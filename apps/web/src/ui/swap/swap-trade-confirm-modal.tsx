import ConfirmSwapModal from "@/components/swap/ConfirmSwapModal"
import {
  useDerivedSwapState,
  useSwapTrade,
} from "@/ui/swap/derived-swap-state-provider"
import { UseTradeReturn } from "@rcpswap/router"
import { useDerivedSwapTradeState } from "./derived-swap-trade-state-provider"
import { useCallback, useRef } from "react"
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi"
import { ROUTE_PROCESSOR_3_ADDRESS } from "rcpswap/config"
import { routeProcessor2Abi } from "rcpswap/abi"
import {
  getShortenAddress,
  isAddress,
  waitForTransaction,
} from "@rcpswap/wagmi"
import { Amount } from "rcpswap/currency"
import { finalizeTransaction, useAddTransaction } from "@rcpswap/dexie"
import { useAddPopup } from "@/state/application/hooks"
import { RouteStatus } from "@rcpswap/tines"
import { gasMargin } from "rcpswap"
import confirmPriceImpactWithoutFee from "@/components/swap/confirmPriceImpactWithoutFee"

export default function SwapTradeConfirmModal() {
  const {
    state: { swapMode, recipient, chainId0, chainId1 },
    mutate: { setSwapAmount },
  } = useDerivedSwapState()

  const trade = useSwapTrade().data as UseTradeReturn

  const addTransaction = useAddTransaction()
  const addPopup = useAddPopup()
  const { address } = useAccount()

  const {
    state: {
      showConfirm,
      tradeToConfirm,
      attemptingTxn,
      txHash,
      swapErrorMessage,
    },
    mutate: {
      setTradeToConfirm,
      setShowConfirm,
      setSwapErrorMessage,
      setAttemptingTxn,
      setTxHash,
    },
  } = useDerivedSwapTradeState()

  const { config, error } = usePrepareContractWrite({
    chainId: chainId0,
    address: ROUTE_PROCESSOR_3_ADDRESS[chainId0],
    abi: routeProcessor2Abi,
    functionName: tradeToConfirm?.functionName,
    args: tradeToConfirm?.writeArgs as any,
    enabled: Boolean(
      tradeToConfirm?.writeArgs &&
        tradeToConfirm.route.status !== RouteStatus.NoWay
    ),
    value: tradeToConfirm?.value ?? 0n,
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
    onSuccess: async (data) => {
      console.log(data)
      setAttemptingTxn(false)
      setTxHash(data.hash)
      setSwapErrorMessage(undefined)

      const baseText = `Swap ${tradeToConfirm?.amountIn?.toSignificant(3)} ${
        tradeToConfirm?.amountIn?.currency.symbol
      } for ${tradeToConfirm?.amountOut
        ?.subtract(
          tradeToConfirm.feeAmount ??
            Amount.fromRawAmount(tradeToConfirm.amountOut.currency, 0)
        )
        .toSignificant(3)} ${tradeToConfirm?.amountOut?.currency.symbol} ${
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

  const handleAcceptChanges = useCallback(() => {
    setTradeToConfirm(trade)
  }, [setTradeToConfirm, trade, chainId0, chainId1])

  const handleConfirmDismiss = useCallback(() => {
    setShowConfirm(false)

    if (txHash) {
      setSwapAmount("")
    }
  }, [setShowConfirm, txHash, setSwapAmount])

  const handleSwap = useCallback(async () => {
    try {
      if (error) {
        setSwapErrorMessage(error.message)
        setAttemptingTxn(false)
        setTxHash(undefined)
        return
      }
      if (
        tradeToConfirm?.priceImpact &&
        !confirmPriceImpactWithoutFee(tradeToConfirm.priceImpact)
      ) {
        return
      }

      setAttemptingTxn(true)
      setSwapErrorMessage(undefined)
      setTxHash(undefined)

      await writeAsync?.()
    } catch (err) {}
  }, [tradeToConfirm, writeAsync, error])

  return (
    <ConfirmSwapModal
      swapMode={swapMode}
      isOpen={showConfirm}
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      onDismiss={handleConfirmDismiss}
    />
  )
}
