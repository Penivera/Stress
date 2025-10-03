"use client"

import { ReactNode } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

const network = WalletAdapterNetwork.Mainnet
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]

// Placeholder manifest URL - replace with your actual manifest
const tonManifestUrl = 'https://refactored-halibut-x5rjw7j9g676f4r7-5500.app.github.dev/tonconnect-manifest.json'

export function WalletProviders({ children }: { children: ReactNode }) {
    return (
        <ConnectionProvider endpoint={`https://api.mainnet-beta.solana.com`}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <TonConnectUIProvider manifestUrl={tonManifestUrl}>
                        {children}
                    </TonConnectUIProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}