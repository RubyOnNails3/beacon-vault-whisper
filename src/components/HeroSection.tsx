import { Zap, Lock, FileText, Eye, BarChart3, Users, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useReadContract } from 'wagmi'
import { BEACON_VAULT_WHISPER_CONTRACT_ADDRESS, BEACON_VAULT_WHISPER_ABI } from "@/lib/contracts"

interface HeroSectionProps {
  onSubmitReport: () => void
  onViewInbox: () => void
  isConnected: boolean
}

export function HeroSection({ onSubmitReport, onViewInbox, isConnected }: HeroSectionProps) {
  // Read contract statistics
  const { data: totalReports } = useReadContract({
    address: BEACON_VAULT_WHISPER_CONTRACT_ADDRESS,
    abi: BEACON_VAULT_WHISPER_ABI,
    functionName: 'getTotalReports',
  })

  const { data: totalInvestigations } = useReadContract({
    address: BEACON_VAULT_WHISPER_CONTRACT_ADDRESS,
    abi: BEACON_VAULT_WHISPER_ABI,
    functionName: 'getTotalInvestigations',
  })

  const { data: totalActions } = useReadContract({
    address: BEACON_VAULT_WHISPER_CONTRACT_ADDRESS,
    abi: BEACON_VAULT_WHISPER_ABI,
    functionName: 'getTotalActions',
  })

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="flex items-center justify-center mb-6">
          <Zap className="w-16 h-16 text-purple-500" />
        </div>
        
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-security-primary to-security-success bg-clip-text text-transparent">
          Beacon Vault Whisper
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Secure DAO whistleblowing platform with FHE encryption. Submit confidential reports 
          with complete anonymity protection. Only authorized compliance officers can decrypt submissions.
        </p>

        {/* Contract Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <Card className="p-6 bg-gradient-subtle border-security-primary/20">
            <div className="flex items-center justify-center mb-3">
              <FileText className="w-8 h-8 text-security-primary" />
            </div>
            <h3 className="text-2xl font-bold text-security-primary">
              {totalReports?.toString() || '0'}
            </h3>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </Card>

          <Card className="p-6 bg-gradient-subtle border-security-secondary/20">
            <div className="flex items-center justify-center mb-3">
              <Eye className="w-8 h-8 text-security-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-security-secondary">
              {totalInvestigations?.toString() || '0'}
            </h3>
            <p className="text-sm text-muted-foreground">Active Investigations</p>
          </Card>

          <Card className="p-6 bg-gradient-subtle border-security-success/20">
            <div className="flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-security-success" />
            </div>
            <h3 className="text-2xl font-bold text-security-success">
              {totalActions?.toString() || '0'}
            </h3>
            <p className="text-sm text-muted-foreground">Actions Executed</p>
          </Card>
        </div>

        {isConnected ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="p-6 hover:shadow-card transition-all duration-300 bg-gradient-subtle border-security-primary/20">
              <FileText className="w-12 h-12 text-security-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Submit Report</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Safely submit encrypted reports with FHE protection and full anonymity
              </p>
              <Button 
                onClick={onSubmitReport}
                variant="security"
                className="w-full"
              >
                Submit Confidential Report
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-card transition-all duration-300 bg-gradient-subtle border-security-secondary/20">
              <Eye className="w-12 h-12 text-security-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compliance Inbox</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Review encrypted submissions as an authorized compliance officer
              </p>
              <Button 
                onClick={onViewInbox}
                variant="outline"
                className="w-full border-security-secondary/50 hover:bg-security-secondary/10"
              >
                Access Secure Inbox
              </Button>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 p-6 bg-security-warning/10 border border-security-warning/20 rounded-lg max-w-md mx-auto">
            <Lock className="w-6 h-6 text-security-warning" />
            <p className="text-security-warning font-medium">
              Connect your wallet to access secure features
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-2">FHE Encryption</h4>
              <p className="text-sm text-muted-foreground">
                Reports are encrypted using Fully Homomorphic Encryption technology
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-security-success flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-2">Anonymous Protection</h4>
              <p className="text-sm text-muted-foreground">
                Complete anonymity guaranteed through blockchain and FHE technology
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <BarChart3 className="w-6 h-6 text-security-secondary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-2">Smart Contract Integration</h4>
              <p className="text-sm text-muted-foreground">
                Decentralized and transparent reporting system with encrypted data
              </p>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-16 p-6 bg-gradient-subtle border border-security-primary/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-security-success" />
              <span>FHE-encrypted sensitive data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-security-success" />
              <span>DAO member reputation system</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-security-success" />
              <span>Investigation tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-security-success" />
              <span>Compliance action execution</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-security-success" />
              <span>IPFS content storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-security-success" />
              <span>Multi-chain support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}