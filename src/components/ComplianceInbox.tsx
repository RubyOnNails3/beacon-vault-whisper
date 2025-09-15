import { useState, useEffect } from "react"
import { useAccount, useReadContract } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Shield, Clock, AlertTriangle, CheckCircle2, User, Calendar } from "lucide-react"
import { BEACON_VAULT_WHISPER_CONTRACT_ADDRESS, BEACON_VAULT_WHISPER_ABI, REPORT_CATEGORIES, SEVERITY_LEVELS, INVESTIGATION_STATUS } from "@/lib/contracts"
import { formatTimestamp } from "@/lib/fhe-utils"

interface ReportItem {
  id: number
  severity: number
  category: number
  isVerified: boolean
  isProcessed: boolean
  reportHash: string
  reporter: string
  assignedInvestigator: string
  timestamp: number
  deadline: number
}

interface InvestigationItem {
  id: number
  reportId: number
  status: number
  priority: number
  isActive: boolean
  findingsHash: string
  investigator: string
  startTime: number
  endTime: number
}

interface ComplianceInboxProps {
  onBack: () => void
}

export function ComplianceInbox({ onBack }: ComplianceInboxProps) {
  const [selectedReport, setSelectedReport] = useState<number | null>(null)
  const [reports, setReports] = useState<ReportItem[]>([])
  const [investigations, setInvestigations] = useState<InvestigationItem[]>([])
  
  const { address, isConnected } = useAccount()

  // Read total reports count
  const { data: totalReports } = useReadContract({
    address: BEACON_VAULT_WHISPER_CONTRACT_ADDRESS,
    abi: BEACON_VAULT_WHISPER_ABI,
    functionName: 'getTotalReports',
  })

  // Read total investigations count
  const { data: totalInvestigations } = useReadContract({
    address: BEACON_VAULT_WHISPER_CONTRACT_ADDRESS,
    abi: BEACON_VAULT_WHISPER_ABI,
    functionName: 'getTotalInvestigations',
  })

  // Load reports data
  useEffect(() => {
    const loadReports = async () => {
      if (!totalReports) return
      
      const reportsData: ReportItem[] = []
      const reportCount = Number(totalReports)
      
      for (let i = 0; i < reportCount; i++) {
        try {
          // In a real implementation, you would call getReport for each report ID
          // For now, we'll use mock data based on the contract structure
          reportsData.push({
            id: i,
            severity: Math.floor(Math.random() * 5) + 1,
            category: Math.floor(Math.random() * 10) + 1,
            isVerified: Math.random() > 0.5,
            isProcessed: Math.random() > 0.3,
            reportHash: `Qm${Math.random().toString(36).substring(2, 46)}`,
            reporter: `0x${Math.random().toString(16).substring(2, 42)}`,
            assignedInvestigator: Math.random() > 0.5 ? `0x${Math.random().toString(16).substring(2, 42)}` : '0x0000000000000000000000000000000000000000',
            timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 30 * 24 * 60 * 60),
            deadline: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 30 * 24 * 60 * 60)
          })
        } catch (error) {
          console.error(`Error loading report ${i}:`, error)
        }
      }
      
      setReports(reportsData)
    }

    loadReports()
  }, [totalReports])

  // Load investigations data
  useEffect(() => {
    const loadInvestigations = async () => {
      if (!totalInvestigations) return
      
      const investigationsData: InvestigationItem[] = []
      const investigationCount = Number(totalInvestigations)
      
      for (let i = 0; i < investigationCount; i++) {
        try {
          // In a real implementation, you would call getInvestigation for each investigation ID
          investigationsData.push({
            id: i,
            reportId: Math.floor(Math.random() * (reports.length || 1)),
            status: Math.floor(Math.random() * 5) + 1,
            priority: Math.floor(Math.random() * 5) + 1,
            isActive: Math.random() > 0.3,
            findingsHash: Math.random() > 0.5 ? `Qm${Math.random().toString(36).substring(2, 46)}` : '',
            investigator: `0x${Math.random().toString(16).substring(2, 42)}`,
            startTime: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 7 * 24 * 60 * 60),
            endTime: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 30 * 24 * 60 * 60)
          })
        } catch (error) {
          console.error(`Error loading investigation ${i}:`, error)
        }
      }
      
      setInvestigations(investigationsData)
    }

    loadInvestigations()
  }, [totalInvestigations, reports.length])

  const getStatusIcon = (report: ReportItem) => {
    if (report.isProcessed) {
      return <CheckCircle2 className="w-4 h-4 text-security-success" />
    } else if (report.assignedInvestigator !== '0x0000000000000000000000000000000000000000') {
      return <Eye className="w-4 h-4 text-security-primary" />
    } else {
      return <Clock className="w-4 h-4 text-security-warning" />
    }
  }

  const getStatusText = (report: ReportItem) => {
    if (report.isProcessed) {
      return 'resolved'
    } else if (report.assignedInvestigator !== '0x0000000000000000000000000000000000000000') {
      return 'reviewing'
    } else {
      return 'pending'
    }
  }

  const getPriorityColor = (severity: number) => {
    switch (severity) {
      case 5:
      case 4:
        return 'bg-destructive text-destructive-foreground'
      case 3:
        return 'bg-security-warning text-primary-foreground'
      case 2:
      case 1:
        return 'bg-secondary text-secondary-foreground'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  const getPriorityText = (severity: number) => {
    switch (severity) {
      case 5:
      case 4:
        return 'high'
      case 3:
        return 'medium'
      case 2:
      case 1:
        return 'low'
      default:
        return 'low'
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isDeadlinePassed = (deadline: number) => {
    return Date.now() / 1000 > deadline
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4 border-security-primary/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-subtle border-security-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-security rounded-lg">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{totalReports?.toString() || '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle border-security-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-security rounded-lg">
                <Eye className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Investigations</p>
                <p className="text-2xl font-bold">{totalInvestigations?.toString() || '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle border-security-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-security rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved Reports</p>
                <p className="text-2xl font-bold">{reports.filter(r => r.isProcessed).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card bg-gradient-subtle border-security-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-security rounded-lg">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Compliance Officer Inbox</CardTitle>
              <p className="text-sm text-muted-foreground">Encrypted whistleblower reports with FHE protection</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50 bg-card/30"
                onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(report)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {REPORT_CATEGORIES[report.category as keyof typeof REPORT_CATEGORIES] || 'Unknown Category'}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          RPT-{report.id.toString().padStart(3, '0')}
                        </Badge>
                        {report.isVerified && (
                          <Badge variant="outline" className="text-xs text-security-success border-security-success">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>Severity: {SEVERITY_LEVELS[report.severity as keyof typeof SEVERITY_LEVELS] || 'Unknown'}</span>
                        <span>•</span>
                        <span>{formatDate(report.timestamp)}</span>
                        <span>•</span>
                        <span>Reporter: {formatAddress(report.reporter)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(report.severity)}>
                      {getPriorityText(report.severity)}
                    </Badge>
                    <Badge variant="outline">
                      {getStatusText(report)}
                    </Badge>
                    {isDeadlinePassed(report.deadline) && (
                      <Badge variant="destructive">
                        Overdue
                      </Badge>
                    )}
                  </div>
                </div>
                
                {selectedReport === report.id && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Reporter:</span>
                          <span className="font-mono">{formatAddress(report.reporter)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Deadline:</span>
                          <span>{formatDate(report.deadline)}</span>
                        </div>
                        {report.assignedInvestigator !== '0x0000000000000000000000000000000000000000' && (
                          <div className="flex items-center gap-2 text-sm">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Investigator:</span>
                            <span className="font-mono">{formatAddress(report.assignedInvestigator)}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Report Hash:</span>
                          <p className="font-mono text-xs break-all">{report.reportHash}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-security-primary/10 border border-security-primary/20 rounded-lg mb-4">
                      <AlertTriangle className="w-5 h-5 text-security-primary" />
                      <p className="text-sm text-security-primary font-medium">
                        This report contains FHE-encrypted content. Decryption requires authorized compliance officer credentials.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button 
                        variant="security"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle decryption and review
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Decrypt & Review
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="border-security-secondary/50 hover:bg-security-secondary/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle status update
                        }}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
          
          {reports.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports in the inbox</p>
              <p className="text-sm text-muted-foreground mt-2">
                Reports will appear here once submitted by DAO members
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}