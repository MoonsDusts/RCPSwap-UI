import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, JSBI, Percent, Token, WETH } from '@rcpswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { StaticImageData } from 'next/image'

import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'

import ArbitrumNova from '../assets/images/networks/42170.png'
import Polygon from '../assets/images/networks/137.png'


export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ZERO_ONE_ADDRESS = '0x0000000000000000000000000000000000000001'

export const ROUTER_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.POLYGON]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [ChainId.ARBITRUM_NOVA]: '0x28e0f3ebab59a998C4f1019358388B5E2ca92cfA',
}

export const WEB_INTERFACES: { [chainId in ChainId]: string[] } = {
  [ChainId.POLYGON]: ['quickswap.exchange/'],
  [ChainId.ARBITRUM_NOVA]: ['rcpswap.com'],
}

export { PRELOADED_PROPOSALS } from './proposals'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(
  ChainId.ARBITRUM_NOVA,
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDC = new Token(ChainId.ARBITRUM_NOVA, '0x750ba8b76187092b0d1e87e28daaf484d1b5273b', 6, 'USDC', 'USD//C')
export const USDT = new Token(
  ChainId.ARBITRUM_NOVA,
  '0x52484e1ab2e2b22420a25c20fa49e173a26202cd',
  6,
  'USDT',
  'Tether USD'
)

export const MOON = new Token(ChainId.ARBITRUM_NOVA, '0x0057ac2d777797d31cd3f8f13bf5e927571d6ad0', 18, 'MOON', 'Moons')
export const BRICK = new Token(
  ChainId.ARBITRUM_NOVA,
  '0x6dcb98f460457fe4952e12779ba852f82ecc62c1',
  18,
  'BRICK',
  'Bricks'
)
export const ARB = new Token(ChainId.ARBITRUM_NOVA, '0xf823c3cd3cebe0a1fa952ba88dc9eef8e0bf46ad', 18, 'ARB', 'Arbitrum')
export const WBTC = {

  [ChainId.ARBITRUM_NOVA]: new Token(
    ChainId.ARBITRUM_NOVA,
    '0x1d05e4e72cd994cdf976181cfb0707345763564d',
    8,
    'WBTC',
    'Wrapped BTC'
  )
}


// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed timeimage.png
export const AVERAGE_BLOCK_TIME_IN_SECS = 13
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const FALLBACK_GAS_LIMIT = BigNumber.from(6721900)


const WETH_ONLY: ChainTokenList = {
  [ChainId.POLYGON]: [WETH[ChainId.POLYGON]],
  [ChainId.ARBITRUM_NOVA]: [WETH[ChainId.ARBITRUM_NOVA]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.ARBITRUM_NOVA]: [
    ...WETH_ONLY[ChainId.ARBITRUM_NOVA],
    DAI,
    USDC,
    MOON,
    BRICK,
    ARB,
    WBTC[ChainId.ARBITRUM_NOVA]
  ]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.ARBITRUM_NOVA]: [...WETH_ONLY[ChainId.ARBITRUM_NOVA], DAI, USDC, MOON, BRICK]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.ARBITRUM_NOVA]: [...WETH_ONLY[ChainId.ARBITRUM_NOVA], DAI, USDT, USDC, MOON, BRICK]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export interface DexInfo {
  name: string
  factory: string
  router: string
  initCode: string
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    mobile: true
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(200), BIPS_BASE) // 2%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(201), BIPS_BASE) // 2.01%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.multiply(JSBI.BigInt(5), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(14))) // .0001 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_FUSION_TRADES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.ARBITRUM_NOVA]: [...WETH_ONLY[ChainId.ARBITRUM_NOVA], DAI, USDT, USDC]
}

export const SUPPORTED_CROSS_CHAIN_NETWORKS = [
  {
    id: ChainId.ARBITRUM_NOVA,
    name: 'Arbitrum Nova',
    icon: ArbitrumNova
  },
  {
    id: ChainId.POLYGON,
    name: 'Polygon',
    icon: Polygon
  }
]

export const SUPPORTED_CHAIN_RPCS: { [chainId in ChainId]?: string } = {
  [ChainId.ARBITRUM_NOVA]: 'https://nova.arbitrum.io/rpc',
  [ChainId.POLYGON]: 'https://polygon.llamarpc.com'
}