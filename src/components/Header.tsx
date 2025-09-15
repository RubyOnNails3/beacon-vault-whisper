import { Shield } from "lucide-react"
import { WalletConnect } from "./WalletConnect"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-security rounded-lg shadow-glow">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-security-primary to-security-success bg-clip-text text-transparent">
              Beacon Vault Whisper
            </h1>
            <p className="text-xs text-muted-foreground">Secure DAO Whistleblowing</p>
          </div>
        </div>
        <WalletConnect />
      </div>
    </header>
  )
}