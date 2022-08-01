import { Blockchain, Currency, ETHER, BINANCE_COIN, ARBITRUM_NOVA } from '@venomswap/sdk'

export default function getBlockchainAdjustedCurrency(
  blockchain: Blockchain,
  currency: Currency | undefined
): Currency | undefined {
  if (!currency) return currency
  if (currency !== ETHER) return currency
  switch (blockchain) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return BINANCE_COIN
    case Blockchain.ARBITRUM_NOVA:
      return ARBITRUM_NOVA
    default:
      return ETHER
  }
}
