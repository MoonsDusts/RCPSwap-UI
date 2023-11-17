import { ChainId } from '@rcpswap/sdk'
import { useQuery } from '@tanstack/react-query'
import { useBlockNumber } from '@/state/application/hooks'
import { usePublicClient } from 'wagmi'

export function useGasPrice(chainId?: ChainId) {
  const blockNumber = useBlockNumber(chainId)
  const publicClient = usePublicClient({ chainId: ChainId.ARBITRUM_NOVA })

  const { data: gasPrice } = useQuery({
    queryKey: ['useGasPrice', blockNumber],
    queryFn: async () => parseInt((await publicClient?.getGasPrice())?.toString() ?? '10000000')
  })

  return gasPrice
}
