import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia, mainnet, arbitrum, polygon } from 'wagmi/chains'

// Get projectId from https://cloud.walletconnect.com
const projectId = process.env.VITE_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475'

export const config = getDefaultConfig({
  appName: 'Beacon Vault Whisper',
  projectId,
  chains: [sepolia, mainnet, arbitrum, polygon],
  ssr: false, // If your dApp uses server side rendering (SSR)
})