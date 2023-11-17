import { ButtonConfirmed, ButtonError } from "@/components/Button"
import Checker from "@/components/Checker"
import Column from "@/components/Column"
import Loader from "@/components/Loader"
import { AutoRow, RowBetween } from "@/components/Row"
import {
  useDerivedSwapState,
  useSwapTrade,
} from "@/ui/swap/derived-swap-state-provider"
import {
  ApprovalState,
  getShortenAddress,
  isAddress,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  waitForTransaction,
} from "@rcpswap/wagmi"
import { ROUTE_PROCESSOR_3_ADDRESS } from "rcpswap/config"
import { Amount, tryParseAmount } from "rcpswap/currency"
import { useCallback, useMemo, useRef } from "react"
import { Text } from "rebass"
import ProgressSteps from "@/components/ProgressSteps"
import { useDerivedSwapTradeState } from "./derived-swap-trade-state-provider"
import { UseTradeReturn } from "@rcpswap/router"
import { useExpertMode } from "@rcpswap/hooks"
import { warningSeverity } from "@/utils"
import { routeProcessor2Abi } from "rcpswap/abi"
import { RouteStatus } from "@rcpswap/tines"
import { gasMargin } from "rcpswap/calculate"
import confirmPriceImpactWithoutFee from "@/components/swap/confirmPriceImpactWithoutFee"
import { useAddTransaction, finalizeTransaction } from "@rcpswap/dexie"
import { useAddPopup } from "@/state/application/hooks"

export default function SwapTradeButton() {
  const {
    state: { chainId0, token0, swapAmount, token1, recipient, chainId1 },
  } = useDerivedSwapState()

  const [isExpertMode] = useExpertMode()
  const tradeRef = useRef<UseTradeReturn | undefined>()
  const { address } = useAccount()

  const {
    state: {},
    mutate: {
      setTradeToConfirm,
      setAttemptingTxn,
      setSwapErrorMessage,
      setShowConfirm,
      setTxHash,
    },
  } = useDerivedSwapTradeState()

  const { data, isInitialLoading: isLoading } = useSwapTrade()
  const trade = data as UseTradeReturn

  const addTransaction = useAddTransaction()
  const addPopup = useAddPopup()

  const { config, error } = usePrepareContractWrite({
    chainId: chainId0,
    address: ROUTE_PROCESSOR_3_ADDRESS[chainId0],
    abi: routeProcessor2Abi,
    functionName: trade?.functionName,
    args: trade?.writeArgs as any,
    enabled: Boolean(
      trade?.writeArgs &&
        trade.route.status !== RouteStatus.NoWay &&
        chainId0 === chainId1
    ),
    value: trade?.value ?? 0n,
    onError: () => {},
  })

  const { writeAsync } = useContractWrite({
    ...config,
    request: config?.request
      ? {
          ...config.request,
          gas:
            typeof config.request.gas === "bigint"
              ? gasMargin(config.request.gas)
              : undefined,
        }
      : undefined,
    onMutate: () => {
      if (tradeRef && trade) {
        tradeRef.current = trade
      }
    },
    onSuccess: async (data) => {
      console.log(data)
      setAttemptingTxn(false)
      setTxHash(data.hash)
      setSwapErrorMessage(undefined)

      const baseText = `Swap ${tradeRef.current?.amountIn?.toSignificant(3)} ${
        tradeRef.current?.amountIn?.currency.symbol
      } for ${tradeRef.current?.amountOut
        ?.subtract(
          tradeRef.current.feeAmount ??
            Amount.fromRawAmount(tradeRef.current.amountOut.currency, 0)
        )
        .toSignificant(3)} ${tradeRef.current?.amountOut?.currency.symbol} ${
        recipient !== undefined && recipient !== address && isAddress(recipient)
          ? `to ${getShortenAddress(recipient)}`
          : ""
      }`

      addTransaction(address ?? "", chainId0, data.hash, baseText)

      waitForTransaction({ hash: data.hash }).then((receipt) => {
        finalizeTransaction(data.hash, receipt)

        addPopup(
          {
            txn: {
              hash: data.hash,
              success: receipt.status === "success",
              summary: baseText,
            },
          },
          data.hash
        )
      })
    },
    onError: (error) => {
      setSwapErrorMessage(error.message)
      setAttemptingTxn(false)
      setTxHash(undefined)
    },
  })

  const parsedAmount = useMemo(
    () => tryParseAmount(swapAmount, token0),
    [token0, swapAmount]
  )

  const handleSwap = useCallback(async () => {
    try {
      if (error) {
        setSwapErrorMessage(error.message)
        setAttemptingTxn(false)
        setTxHash(undefined)
        return
      }
      if (!isExpertMode) {
        setTradeToConfirm(trade)
        setAttemptingTxn(false)
        setSwapErrorMessage(undefined)
        setShowConfirm(true)
        setTxHash(undefined)
      } else {
        setAttemptingTxn(true)
        setSwapErrorMessage(undefined)
        setTxHash(undefined)
        if (
          trade?.priceImpact &&
          !confirmPriceImpactWithoutFee(trade?.priceImpact)
        ) {
          return
        }
        await writeAsync?.()
      }
    } catch (err) {}
  }, [
    setTradeToConfirm,
    setAttemptingTxn,
    setSwapErrorMessage,
    setShowConfirm,
    setTxHash,
    trade,
    writeAsync,
    config,
    isExpertMode,
    error,
  ])

  const isWrap = token0?.isNative && token1?.equals(token0.wrapped)
  const isUnWrap = token1?.isNative && token0?.equals(token1.wrapped)

  const priceImpactSeverity = useMemo(
    () => warningSeverity((trade as UseTradeReturn)?.priceImpact),
    [trade]
  )

  return (
    <Checker.Connect>
      <Checker.Network chainId={chainId0}>
        <Checker.Amounts chainId={chainId0} amounts={[parsedAmount]}>
          <Checker.Error
            error={
              isLoading
                ? "Fetching the best price"
                : trade?.route?.status === RouteStatus.NoWay
                ? "Insufficient liquidity for this trade."
                : undefined
            }
          >
            <Checker.ApproveERC20
              amount={parsedAmount}
              contract={ROUTE_PROCESSOR_3_ADDRESS[chainId0]}
            >
              {(approvalSubmitted, approvalState, approve) =>
                approvalState === ApprovalState.NOT_APPROVED ||
                approvalState === ApprovalState.PENDING ||
                (approvalSubmitted &&
                  approvalState === ApprovalState.APPROVED) ? (
                  <>
                    <RowBetween>
                      <ButtonConfirmed
                        onClick={() => approve?.()}
                        disabled={
                          approvalState !== ApprovalState.NOT_APPROVED ||
                          approvalSubmitted
                        }
                        width="48%"
                        altDisabledStyle={
                          approvalState === ApprovalState.PENDING
                        }
                        confirmed={approvalState === ApprovalState.APPROVED}
                      >
                        {approvalState === ApprovalState.PENDING ? (
                          <AutoRow gap="6px" justify="center">
                            Approving <Loader stroke="white" />
                          </AutoRow>
                        ) : approvalSubmitted &&
                          approvalState === ApprovalState.APPROVED ? (
                          "Approved"
                        ) : (
                          "Approve " + token0?.symbol
                        )}
                      </ButtonConfirmed>
                      <ButtonError
                        onClick={handleSwap}
                        width="48%"
                        id="swap-button"
                        disabled={
                          approvalState !== ApprovalState.APPROVED ||
                          (priceImpactSeverity > 3 && !isExpertMode)
                        }
                      >
                        <Text fontSize={16} fontWeight={500}>
                          {isWrap
                            ? "Wrap"
                            : isUnWrap
                            ? "Unwrap"
                            : priceImpactSeverity > 3 && !isExpertMode
                            ? "Price Impact High"
                            : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
                        </Text>
                      </ButtonError>
                    </RowBetween>
                    <Column style={{ marginTop: "1rem" }}>
                      <ProgressSteps
                        steps={[approvalState === ApprovalState.APPROVED]}
                      />
                    </Column>
                  </>
                ) : (
                  <ButtonError
                    onClick={handleSwap}
                    id="swap-button"
                    disabled={
                      approvalState !== ApprovalState.APPROVED ||
                      (priceImpactSeverity > 3 && !isExpertMode)
                    }
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {isWrap
                        ? "Wrap"
                        : isUnWrap
                        ? "Unwrap"
                        : priceImpactSeverity > 3 && !isExpertMode
                        ? "Price Impact High"
                        : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
                    </Text>
                  </ButtonError>
                )
              }
            </Checker.ApproveERC20>
          </Checker.Error>
        </Checker.Amounts>
      </Checker.Network>
    </Checker.Connect>
  )
}
