import { configureChains, createConfig } from 'wagmi'
import { arbitrumNova, polygon } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { InjectedConnector } from 'wagmi/connectors/injected'

import { publicProvider } from 'wagmi/providers/public'

const walletConnectProjectId = '6ad02f9ab9bf39893167c8d7e962f5cf'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrumNova, polygon],
  [
    publicProvider(),
  ],
)

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        showQrModal: true,
        projectId: walletConnectProjectId,
        metadata: {
          name: 'RCPSwap',
          description: 'Reddit Community Points Swap',
          url: 'https://www.rcpswap.com',
          icons: ['https://www.rcpswap.com/favicon.png']
        },
      },
    }),
    new LedgerConnector({
      chains,
      options: {
        projectId: walletConnectProjectId
      }
    })
  ],
  publicClient,
  webSocketPublicClient,
})
