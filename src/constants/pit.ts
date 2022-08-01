import { ChainId, Token } from '@venomswap/sdk'
import getPairTokensWithDefaults from '../utils/getPairTokensWithDefaults'

export const PIT_POOLS: {
  [chainId in ChainId]?: {
    pid: number
    tokens: [Token, Token]
  }[]
} = {
  [ChainId.NOVA_MAINNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'WONE/BUSD')
    },
    {
      pid: 1,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'WONE/VIPER')
    },
    {
      pid: 2,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'WONE/1ETH')
    },
    {
      pid: 3,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'BUSD/VIPER')
    },
    {
      pid: 4,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'BUSD/bscBUSD')
    }
  ],
  [ChainId.NOVA_TESTNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_TESTNET, 'WONE/BUSD')
    }
  ],
  [ChainId.BSC_TESTNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/BUSD')
    },
    {
      pid: 1,
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/COBRA')
    }
  ]
}
