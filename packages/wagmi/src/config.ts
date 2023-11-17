import { allChains, allProviders } from '@rcpswap/wagmi-config'
import { configureChains, createConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

export const createProductionConfig = () => {
  const { chains, publicClient } = configureChains(allChains, allProviders, {
    pollingInterval: 4_000,
  })

  return createConfig({
    publicClient,
    autoConnect: true,
    connectors: [
      new InjectedConnector({
        chains,
        options: {
          shimDisconnect: true,
        },
      }),
      new MetaMaskConnector({
        chains,
        options: {
          shimDisconnect: true,
        },
      }),
      new LedgerConnector({
        chains,
        options: {},
      }),
      new WalletConnectConnector({
        chains,
        options: {
          showQrModal: true,
          projectId: '187b0394dbf3b20ce7762592560eafd2',
          metadata: {
            name: 'RCPSwap',
            description: 'Reddit Community Points Swap',
            url: 'https://www.rcpswap.com',
            icons: ['https://www.rcpswap.com/icon.png'],
          },
        },
      }),
      new CoinbaseWalletConnector({
        // TODO: Flesh out coinbase wallet connect options?
        chains,
        options: {
          appName: 'RCPSwap',
          appLogoUrl:
            'https://www.rcpswap.com/icon.png',
        },
      })
    ],
  })
}

// export const config = createWagmiConfig()
