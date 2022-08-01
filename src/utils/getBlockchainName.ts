import { ChainId } from '@venomswap/sdk'

export default function getBlockchainName(chainId: ChainId | undefined): string {
  switch (chainId) {
    case ChainId.MAINNET:
    case ChainId.ROPSTEN:
    case ChainId.RINKEBY:
    case ChainId.GÖRLI:
    case ChainId.KOVAN:
      return 'Ethereum'
    case ChainId.BSC_MAINNET:
    case ChainId.BSC_TESTNET:
      return 'Binance Smart Chain'
    case ChainId.NOVA_MAINNET:
    case ChainId.NOVA_TESTNET:
      return 'Arbitrum Nova'
    default:
      return 'Ethereum'
  }
}
