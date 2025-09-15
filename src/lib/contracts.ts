import { getContract } from 'viem'
import { sepolia } from 'wagmi/chains'

// Contract ABI - This would be generated from the compiled contract
export const BEACON_VAULT_WHISPER_ABI = [
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "reportId", "type": "uint256"},
      {"indexed": true, "name": "reporter", "type": "address"},
      {"indexed": false, "name": "severity", "type": "uint32"},
      {"indexed": false, "name": "category", "type": "uint32"}
    ],
    "name": "ReportSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "investigationId", "type": "uint256"},
      {"indexed": true, "name": "reportId", "type": "uint256"},
      {"indexed": true, "name": "investigator", "type": "address"}
    ],
    "name": "InvestigationStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "investigationId", "type": "uint256"},
      {"indexed": true, "name": "reportId", "type": "uint256"},
      {"indexed": false, "name": "isResolved", "type": "bool"}
    ],
    "name": "InvestigationCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "actionId", "type": "uint256"},
      {"indexed": true, "name": "reportId", "type": "uint256"},
      {"indexed": true, "name": "executor", "type": "address"}
    ],
    "name": "ComplianceActionExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "member", "type": "address"},
      {"indexed": false, "name": "newReputation", "type": "uint32"}
    ],
    "name": "MemberReputationUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "investigator", "type": "address"},
      {"indexed": false, "name": "newRating", "type": "uint32"}
    ],
    "name": "InvestigatorRatingUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "reportId", "type": "uint256"},
      {"indexed": false, "name": "isVerified", "type": "bool"}
    ],
    "name": "ReportVerified",
    "type": "event"
  },
  
  // Functions
  {
    "inputs": [
      {"name": "_complianceOfficer", "type": "address"},
      {"name": "_chiefInvestigator", "type": "address"}
    ],
    "name": "constructor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"name": "_member", "type": "address"},
      {"name": "_initialReputation", "type": "uint32"},
      {"name": "_accessLevel", "type": "uint32"}
    ],
    "name": "addDAOMember",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_severity", "type": "uint32"},
      {"name": "_category", "type": "uint32"},
      {"name": "_reportHash", "type": "string"},
      {"name": "_deadline", "type": "uint256"}
    ],
    "name": "submitWhistleblowerReport",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_reportId", "type": "uint256"},
      {"name": "_investigator", "type": "address"},
      {"name": "_priority", "type": "uint32"}
    ],
    "name": "startInvestigation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_investigationId", "type": "uint256"},
      {"name": "_status", "type": "uint32"},
      {"name": "_findingsHash", "type": "string"}
    ],
    "name": "updateInvestigationStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_reportId", "type": "uint256"},
      {"name": "_actionType", "type": "uint32"},
      {"name": "_severity", "type": "uint32"},
      {"name": "_actionHash", "type": "string"}
    ],
    "name": "executeComplianceAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_reportId", "type": "uint256"},
      {"name": "_isVerified", "type": "bool"}
    ],
    "name": "verifyReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_investigator", "type": "address"},
      {"name": "_rating", "type": "uint32"}
    ],
    "name": "updateInvestigatorRating",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_reportId", "type": "uint256"}],
    "name": "getReport",
    "outputs": [
      {"name": "reportId", "type": "uint32"},
      {"name": "severity", "type": "uint32"},
      {"name": "category", "type": "uint32"},
      {"name": "isVerified", "type": "bool"},
      {"name": "isProcessed", "type": "bool"},
      {"name": "reportHash", "type": "string"},
      {"name": "reporter", "type": "address"},
      {"name": "assignedInvestigator", "type": "address"},
      {"name": "timestamp", "type": "uint256"},
      {"name": "deadline", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_investigationId", "type": "uint256"}],
    "name": "getInvestigation",
    "outputs": [
      {"name": "investigationId", "type": "uint32"},
      {"name": "reportId", "type": "uint32"},
      {"name": "status", "type": "uint32"},
      {"name": "priority", "type": "uint32"},
      {"name": "isActive", "type": "bool"},
      {"name": "findingsHash", "type": "string"},
      {"name": "investigator", "type": "address"},
      {"name": "startTime", "type": "uint256"},
      {"name": "endTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_member", "type": "address"}],
    "name": "getMemberReputation",
    "outputs": [{"name": "", "type": "uint32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_investigator", "type": "address"}],
    "name": "getInvestigatorRating",
    "outputs": [{"name": "", "type": "uint32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_member", "type": "address"}],
    "name": "isVerifiedMember",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalReports",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalInvestigations",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalActions",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract address - This would be the deployed contract address
export const BEACON_VAULT_WHISPER_ADDRESS = process.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'

// Contract instance
export const getBeaconVaultWhisperContract = (address: `0x${string}`) => {
  return getContract({
    address,
    abi: BEACON_VAULT_WHISPER_ABI,
  })
}

// Contract configuration
export const contractConfig = {
  address: BEACON_VAULT_WHISPER_ADDRESS as `0x${string}`,
  abi: BEACON_VAULT_WHISPER_ABI,
  chainId: sepolia.id,
}

// Report categories
export const REPORT_CATEGORIES = {
  1: 'Financial Misconduct',
  2: 'Governance Violation',
  3: 'Security Breach',
  4: 'Code of Conduct Violation',
  5: 'Resource Misuse',
  6: 'Conflict of Interest',
  7: 'Data Privacy Violation',
  8: 'Regulatory Non-compliance',
  9: 'Internal Fraud',
  10: 'Other'
} as const

// Severity levels
export const SEVERITY_LEVELS = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Critical',
  5: 'Emergency'
} as const

// Investigation status
export const INVESTIGATION_STATUS = {
  1: 'Started',
  2: 'In Progress',
  3: 'Under Review',
  4: 'Pending Action',
  5: 'Completed'
} as const

// Action types
export const ACTION_TYPES = {
  1: 'Warning',
  2: 'Suspension',
  3: 'Removal',
  4: 'Legal Action',
  5: 'Policy Update',
  6: 'Training Required',
  7: 'Audit Initiated',
  8: 'Compensation Adjustment',
  9: 'Governance Change',
  10: 'Other'
} as const
