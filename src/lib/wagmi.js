import { createConfig, createStorage, http } from 'wagmi'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'
import {
  CHAIN_ID, CHAIN_NAME, NATIVE_CURRENCY, L1_RPC,
  BLOCKSCOUT_URL, EXPLORER_NAME, MULTICALL3_ADDRESS,
} from './config'

export const muriTestnet = {
  id: CHAIN_ID,
  name: CHAIN_NAME,
  nativeCurrency: NATIVE_CURRENCY,
  rpcUrls: {
    default: { http: [L1_RPC] },
  },
  blockExplorers: {
    default: { name: EXPLORER_NAME, url: BLOCKSCOUT_URL },
  },
  contracts: {
    multicall3: {
      address: MULTICALL3_ADDRESS,
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
