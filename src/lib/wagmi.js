import { createConfig, createStorage, http } from 'wagmi'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'

export const muriTestnet = {
  id: 44946,
  name: 'MuriData Testnet',
  nativeCurrency: { name: 'MuriCoin', symbol: 'MURI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.muri.moe/ext/bc/2qyiuZtqxCmwRosTYFBsoyTSsupLwsvvFPh9K2inL82Sd8m8Yf/rpc'] },
  },
  blockExplorers: {
    default: { name: 'MuriData Testnet Explorer', url: 'https://testnet-explorer.muri.moe' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
  testnet: true,
}

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''

const connectors = [
  injected(),
  injected({
    target() {
      return {
        id: 'core',
        name: 'Core',
        provider: typeof window !== 'undefined' ? window.avalanche : undefined,
      }
    },
  }),
  walletConnect({ projectId, showQrModal: true }),
  coinbaseWallet({ appName: 'MuriData' }),
]

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

export const wagmiConfig = createConfig({
  chains: [muriTestnet],
  connectors,
  storage: createStorage({ storage: noopStorage }),
  transports: {
    [muriTestnet.id]: http(undefined, { batch: true }),
  },
})

export const queryClient = new QueryClient()
