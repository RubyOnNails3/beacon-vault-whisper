import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Lock, Send, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { contractConfig, REPORT_CATEGORIES, SEVERITY_LEVELS } from "@/lib/contracts"
import { encryptSeverity, encryptCategory, encryptReportContent, validateIPFSHash } from "@/lib/fhe-utils"

interface ReportFormProps {
  onBack: () => void
}

export function ReportForm({ onBack }: ReportFormProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [severity, setSeverity] = useState("")
  const [description, setDescription] = useState("")
  const [evidence, setEvidence] = useState("")
  const [deadline, setDeadline] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit a report.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Encrypt the report content
      const reportContent = {
        title,
        description,
        evidence,
        timestamp: Date.now(),
        reporter: address
      }
      
      const encryptedContent = encryptReportContent(JSON.stringify(reportContent))
      
      // For demo purposes, we'll use a mock IPFS hash
      // In production, this would be uploaded to IPFS
      const reportHash = `Qm${btoa(encryptedContent).substring(0, 44)}`
      
      if (!validateIPFSHash(reportHash)) {
        throw new Error('Invalid report hash generated')
      }

      // Calculate deadline (default 30 days from now)
      const deadlineTimestamp = deadline ? 
        new Date(deadline).getTime() / 1000 : 
        Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)

      // Encrypt sensitive data using FHE
      const encryptedSeverity = encryptSeverity(parseInt(severity))
      const encryptedCategory = encryptCategory(parseInt(category))

      // Submit to contract
      writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'submitWhistleblowerReport',
        args: [
          encryptedSeverity,
          encryptedCategory,
          reportHash,
          BigInt(deadlineTimestamp)
        ],
      })

    } catch (error) {
      console.error('Error submitting report:', error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }

  // Handle transaction success
  if (isSuccess) {
    toast({
      title: "Report Submitted Successfully",
      description: "Your encrypted report has been securely transmitted to compliance officers.",
    })
    
    // Reset form
    setTitle("")
    setCategory("")
    setSeverity("")
    setDescription("")
    setEvidence("")
    setDeadline("")
    setIsSubmitting(false)
    onBack()
  }

  // Handle transaction error
  if (error) {
    toast({
      title: "Transaction Failed",
      description: error.message,
      variant: "destructive"
    })
    setIsSubmitting(false)
  }

  const isLoading = isPending || isConfirming || isSubmitting

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
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

      <Card className="shadow-card bg-gradient-subtle border-security-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-security rounded-lg">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Submit Confidential Report</CardTitle>
              <p className="text-sm text-muted-foreground">All information will be encrypted using FHE before transmission</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of the issue"
                required
                className="bg-background/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REPORT_CATEGORIES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level</Label>
                <Select value={severity} onValueChange={setSeverity} required>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SEVERITY_LEVELS).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about the incident, including dates, individuals involved, and specific actions..."
                required
                className="min-h-32 bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence">Supporting Evidence</Label>
              <Textarea
                id="evidence"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Document any evidence such as transaction IDs, timestamps, witness information, or file descriptions..."
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Investigation Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                If not specified, default deadline is 30 days from submission
              </p>
            </div>

            <div className="flex items-center gap-2 p-4 bg-security-success/10 border border-security-success/20 rounded-lg">
              <Lock className="w-5 h-5 text-security-success" />
              <p className="text-sm text-security-success">
                This report will be encrypted using FHE technology before transmission. Only authorized compliance officers can decrypt and access the content.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isConnected}
              variant="security"
              className="w-full disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  {isPending ? 'Confirming Transaction...' : 
                   isConfirming ? 'Processing...' : 
                   'Encrypting & Submitting...'}
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Encrypted Report
                </>
              )}
            </Button>

            {!isConnected && (
              <p className="text-sm text-muted-foreground text-center">
                Please connect your wallet to submit a report
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}