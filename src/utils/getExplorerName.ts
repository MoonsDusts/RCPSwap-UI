import { Blockchain } from '@venomswap/sdk'

export default function getExplorerName(blockchain: Blockchain): string {
  switch (blockchain) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return 'BSCScan'
    case Blockchain.ARBITRUM_NOVA:
      return 'Arbitrum Nova Explorer'
    default:
      return 'Etherscan'
  }
}
