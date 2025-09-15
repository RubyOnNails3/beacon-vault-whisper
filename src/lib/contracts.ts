import { getAddress } from 'viem';
import BeaconVaultWhisperABI from '../../contracts/BeaconVaultWhisperABI.json';

export const BEACON_VAULT_WHISPER_CONTRACT_ADDRESS = getAddress(
  import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000' // Replace with your deployed contract address
);

export const BEACON_VAULT_WHISPER_ABI = BeaconVaultWhisperABI;

// Report categories
export const REPORT_CATEGORIES = {
  "1": "Financial Misconduct",
  "2": "Governance Violation", 
  "3": "Security Breach",
  "4": "Code of Conduct",
  "5": "Resource Misuse",
  "6": "Conflict of Interest",
  "7": "Data Privacy",
  "8": "Regulatory Non-compliance",
  "9": "Internal Fraud",
  "10": "Other"
} as const;

// Severity levels
export const SEVERITY_LEVELS = {
  "1": "Low - Minor Issue",
  "2": "Medium - Moderate Concern", 
  "3": "High - Serious Issue",
  "4": "Critical - Major Violation",
  "5": "Emergency - Immediate Action Required"
} as const;

// Investigation status
export const INVESTIGATION_STATUS = {
  "1": "Started",
  "2": "In Progress",
  "3": "Under Review",
  "4": "Pending Action",
  "5": "Completed"
} as const;

// Action types
export const ACTION_TYPES = {
  "1": "Warning",
  "2": "Suspension",
  "3": "Removal",
  "4": "Legal Action",
  "5": "Policy Update",
  "6": "Training Required",
  "7": "Audit Initiated",
  "8": "Compensation Adjustment",
  "9": "Governance Change",
  "10": "Other"
} as const;