// FHE utility functions for Beacon Vault Whisper
// These functions handle encryption and decryption of sensitive data

import { euint32, FHE } from '@fhevm/solidity/lib/FHE.sol'

// Encryption functions
export const encryptSeverity = (severity: number): euint32 => {
  if (severity < 1 || severity > 5) {
    throw new Error('Severity must be between 1 and 5')
  }
  return FHE.asEuint32(severity)
}

export const encryptCategory = (category: number): euint32 => {
  if (category < 1 || category > 10) {
    throw new Error('Category must be between 1 and 10')
  }
  return FHE.asEuint32(category)
}

export const encryptPriority = (priority: number): euint32 => {
  if (priority < 1 || priority > 5) {
    throw new Error('Priority must be between 1 and 5')
  }
  return FHE.asEuint32(priority)
}

export const encryptStatus = (status: number): euint32 => {
  if (status < 1 || status > 5) {
    throw new Error('Status must be between 1 and 5')
  }
  return FHE.asEuint32(status)
}

export const encryptActionType = (actionType: number): euint32 => {
  if (actionType < 1 || actionType > 10) {
    throw new Error('Action type must be between 1 and 10')
  }
  return FHE.asEuint32(actionType)
}

export const encryptAccessLevel = (accessLevel: number): euint32 => {
  if (accessLevel < 1 || accessLevel > 5) {
    throw new Error('Access level must be between 1 and 5')
  }
  return FHE.asEuint32(accessLevel)
}

// Decryption functions
export const decryptSeverity = (encryptedSeverity: euint32): number => {
  return encryptedSeverity.decrypt()
}

export const decryptCategory = (encryptedCategory: euint32): number => {
  return encryptedCategory.decrypt()
}

export const decryptPriority = (encryptedPriority: euint32): number => {
  return encryptedPriority.decrypt()
}

export const decryptStatus = (encryptedStatus: euint32): number => {
  return encryptedStatus.decrypt()
}

export const decryptActionType = (encryptedActionType: euint32): number => {
  return encryptedActionType.decrypt()
}

export const decryptAccessLevel = (encryptedAccessLevel: euint32): number => {
  return encryptedAccessLevel.decrypt()
}

// Validation functions
export const validateSeverity = (severity: number): boolean => {
  return severity >= 1 && severity <= 5
}

export const validateCategory = (category: number): boolean => {
  return category >= 1 && category <= 10
}

export const validatePriority = (priority: number): boolean => {
  return priority >= 1 && priority <= 5
}

export const validateStatus = (status: number): boolean => {
  return status >= 1 && status <= 5
}

export const validateActionType = (actionType: number): boolean => {
  return actionType >= 1 && actionType <= 10
}

export const validateAccessLevel = (accessLevel: number): boolean => {
  return accessLevel >= 1 && accessLevel <= 5
}

// Utility functions for reputation management
export const calculateReputationChange = (
  currentReputation: number,
  action: 'report_verified' | 'report_unverified' | 'investigation_completed' | 'action_executed'
): number => {
  switch (action) {
    case 'report_verified':
      return Math.min(currentReputation + 50, 1000) // Cap at 1000
    case 'report_unverified':
      return Math.max(currentReputation - 25, 0) // Floor at 0
    case 'investigation_completed':
      return Math.min(currentReputation + 25, 1000)
    case 'action_executed':
      return Math.min(currentReputation + 10, 1000)
    default:
      return currentReputation
  }
}

// Time utility functions
export const calculateDeadline = (days: number): number => {
  return Date.now() + (days * 24 * 60 * 60 * 1000)
}

export const isDeadlinePassed = (deadline: number): boolean => {
  return Date.now() > deadline
}

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString()
}

// IPFS hash validation
export const validateIPFSHash = (hash: string): boolean => {
  // Basic IPFS hash validation (starts with Qm or bafy)
  return hash.startsWith('Qm') || hash.startsWith('bafy')
}

// Report content encryption simulation
export const encryptReportContent = (content: string): string => {
  // In a real implementation, this would use proper encryption
  // For now, we'll simulate with base64 encoding
  return btoa(content)
}

export const decryptReportContent = (encryptedContent: string): string => {
  // In a real implementation, this would use proper decryption
  // For now, we'll simulate with base64 decoding
  try {
    return atob(encryptedContent)
  } catch (error) {
    throw new Error('Failed to decrypt report content')
  }
}

// Access control utilities
export const hasAccessLevel = (userAccessLevel: number, requiredLevel: number): boolean => {
  return userAccessLevel >= requiredLevel
}

export const canSubmitReport = (reputation: number): boolean => {
  return reputation >= 100 // MIN_REPUTATION_FOR_REPORT
}

export const canInvestigate = (accessLevel: number): boolean => {
  return accessLevel >= 3
}

export const canExecuteActions = (accessLevel: number): boolean => {
  return accessLevel >= 4
}

export const canManageMembers = (accessLevel: number): boolean => {
  return accessLevel >= 5
}
