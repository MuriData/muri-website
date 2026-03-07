import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { QueryClient } from '@tanstack/react-query'

const muriTestnet = {
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

export const wagmiConfig = getDefaultConfig({
  appName: 'MuriData',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
  chains: [muriTestnet],
  transports: {
    [muriTestnet.id]: http(undefined, { batch: true }),
  },
})

export const queryClient = new QueryClient()
