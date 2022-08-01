import { ChainId, Token } from '@venomswap/sdk'
import getPairTokensWithDefaults from '../utils/getPairTokensWithDefaults'

export interface StakingRewardsInfo {
  pid: number
  tokens: [Token, Token]
  active: boolean
}

export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: StakingRewardsInfo[]
} = {
  [ChainId.NOVA_MAINNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'WONE/BUSD'),
      active: true
    },
    {
      pid: 1,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'WONE/VIPER'),
      active: true
    },
    {
      pid: 2,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'WONE/1ETH'),
      active: true
    },
    {
      pid: 3,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'BUSD/VIPER'),
      active: true
    },
    {
      pid: 4,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'BUSD/bscBUSD'),
      active: true
    },
    {
      pid: 5,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'WONE/1USDC'),
      active: true
    },
    {
      pid: 6,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '1ROT/VIPER'),
      active: true
    },
    {
      pid: 7,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '1MAGGOT/VIPER'),
      active: true
    },
    {
      pid: 8,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '1WISE/VIPER'),
      active: true
    },
    {
      pid: 9,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '1DSLA/VIPER'),
      active: true
    },
    {
      pid: 10,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'LINK/VIPER'),
      active: true
    },
    {
      pid: 11,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '1AAVE/VIPER'),
      active: true
    },
    {
      pid: 12,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '1SNX/VIPER'),
      active: true
    },
    {
      pid: 13,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '1YFI/VIPER'),
      active: true
    },
    {
      pid: 14,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '11INCH/VIPER'),
      active: true
    },
    {
      pid: 15,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'bscCAKE/VIPER'),
      active: true
    },
    {
      pid: 16,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '1SUSHI/VIPER'),
      active: true
    },
    {
      pid: 17,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '1UNI/VIPER'),
      active: true
    },
    {
      pid: 18,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, '1WISE/1ETH'),
      active: true
    },
    {
      pid: 19,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'WONE/1WBTC'),
      active: true
    },
    {
      pid: 20,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'WONE/1MATIC'),
      active: true
    },
    {
      pid: 21,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_MAINNET, 'JENN/VIPER'),
      active: true
    }
  ],
  [ChainId.NOVA_TESTNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_TESTNET, 'WONE/1BUSD'),
      active: true
    },
    {
      pid: 1,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_TESTNET, 'WONE/VIPER'),
      active: true
    },
    {
      pid: 2,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_TESTNET, 'WONE/1ETH'),
      active: true
    },
    {
      pid: 3,
      tokens: getPairTokensWithDefaults(ChainId.NOVA_TESTNET, '1BUSD/VIPER'),
      active: true
    }
  ],
  [ChainId.BSC_TESTNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/BUSD'),
      active: true
    },
    {
      pid: 1,
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/COBRA'),
      active: true
    }
  ]
}
