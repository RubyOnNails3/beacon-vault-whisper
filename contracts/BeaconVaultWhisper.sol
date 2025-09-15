// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract BeaconVaultWhisper is SepoliaConfig {
    using FHE for *;
    
    struct WhistleblowerReport {
        euint32 reportId;
        euint32 severity; // 1-5 scale, encrypted
        euint32 category; // 1-10 categories, encrypted
        bool isVerified;
        bool isProcessed;
        string reportHash; // IPFS hash for encrypted content
        address reporter;
        address assignedInvestigator;
        uint256 timestamp;
        uint256 deadline;
    }
    
    struct Investigation {
        euint32 investigationId;
        euint32 reportId;
        euint32 status; // 1-5 status levels, encrypted
        euint32 priority; // 1-5 priority levels, encrypted
        bool isActive;
        string findingsHash; // IPFS hash for encrypted findings
        address investigator;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct ComplianceAction {
        euint32 actionId;
        euint32 reportId;
        euint32 actionType; // 1-10 action types, encrypted
        euint32 severity; // 1-5 severity levels, encrypted
        bool isExecuted;
        string actionHash; // IPFS hash for encrypted action details
        address executor;
        uint256 timestamp;
    }
    
    struct DAOMember {
        euint32 reputation;
        euint32 accessLevel; // 1-5 access levels, encrypted
        bool isActive;
        bool isVerified;
        address memberAddress;
        uint256 joinTime;
        uint256 lastActivity;
    }
    
    mapping(uint256 => WhistleblowerReport) public reports;
    mapping(uint256 => Investigation) public investigations;
    mapping(uint256 => ComplianceAction) public complianceActions;
    mapping(address => DAOMember) public daoMembers;
    mapping(address => euint32) public memberReputation;
    mapping(address => euint32) public investigatorRating;
    
    uint256 public reportCounter;
    uint256 public investigationCounter;
    uint256 public actionCounter;
    
    address public owner;
    address public complianceOfficer;
    address public chiefInvestigator;
    
    uint256 public constant MAX_REPORTS_PER_MEMBER = 10;
    uint256 public constant INVESTIGATION_TIMEOUT = 30 days;
    uint256 public constant MIN_REPUTATION_FOR_REPORT = 100;
    
    event ReportSubmitted(uint256 indexed reportId, address indexed reporter, uint32 severity, uint32 category);
    event InvestigationStarted(uint256 indexed investigationId, uint256 indexed reportId, address indexed investigator);
    event InvestigationCompleted(uint256 indexed investigationId, uint256 indexed reportId, bool isResolved);
    event ComplianceActionExecuted(uint256 indexed actionId, uint256 indexed reportId, address indexed executor);
    event MemberReputationUpdated(address indexed member, uint32 newReputation);
    event InvestigatorRatingUpdated(address indexed investigator, uint32 newRating);
    event ReportVerified(uint256 indexed reportId, bool isVerified);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyComplianceOfficer() {
        require(msg.sender == complianceOfficer || msg.sender == owner, "Only compliance officer can call this function");
        _;
    }
    
    modifier onlyVerifiedMember() {
        require(daoMembers[msg.sender].isVerified, "Only verified DAO members can call this function");
        _;
    }
    
    modifier onlyInvestigator() {
        require(msg.sender == chiefInvestigator || daoMembers[msg.sender].accessLevel.decrypt() >= 3, "Only investigators can call this function");
        _;
    }
    
    constructor(address _complianceOfficer, address _chiefInvestigator) {
        owner = msg.sender;
        complianceOfficer = _complianceOfficer;
        chiefInvestigator = _chiefInvestigator;
        
        // Initialize owner as verified member
        daoMembers[owner] = DAOMember({
            reputation: FHE.asEuint32(1000),
            accessLevel: FHE.asEuint32(5),
            isActive: true,
            isVerified: true,
            memberAddress: owner,
            joinTime: block.timestamp,
            lastActivity: block.timestamp
        });
    }
    
    function addDAOMember(address _member, euint32 _initialReputation, euint32 _accessLevel) 
        external 
        onlyComplianceOfficer 
    {
        require(!daoMembers[_member].isActive, "Member already exists");
        
        daoMembers[_member] = DAOMember({
            reputation: _initialReputation,
            accessLevel: _accessLevel,
            isActive: true,
            isVerified: true,
            memberAddress: _member,
            joinTime: block.timestamp,
            lastActivity: block.timestamp
        });
        
        memberReputation[_member] = _initialReputation;
    }
    
    function submitWhistleblowerReport(
        euint32 _severity,
        euint32 _category,
        string memory _reportHash,
        uint256 _deadline
    ) external onlyVerifiedMember returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        // Check if member has sufficient reputation
        euint32 memberRep = memberReputation[msg.sender];
        require(memberRep.gte(FHE.asEuint32(MIN_REPUTATION_FOR_REPORT)), "Insufficient reputation to submit report");
        
        uint256 reportId = reportCounter++;
        
        reports[reportId] = WhistleblowerReport({
            reportId: FHE.asEuint32(reportId),
            severity: _severity,
            category: _category,
            isVerified: false,
            isProcessed: false,
            reportHash: _reportHash,
            reporter: msg.sender,
            assignedInvestigator: address(0),
            timestamp: block.timestamp,
            deadline: _deadline
        });
        
        // Update member's last activity
        daoMembers[msg.sender].lastActivity = block.timestamp;
        
        emit ReportSubmitted(reportId, msg.sender, _severity.decrypt(), _category.decrypt());
        
        return reportId;
    }
    
    function startInvestigation(
        uint256 _reportId,
        address _investigator,
        euint32 _priority
    ) external onlyComplianceOfficer {
        require(reports[_reportId].reportId.decrypt() == _reportId, "Report does not exist");
        require(!reports[_reportId].isProcessed, "Report already processed");
        require(daoMembers[_investigator].isActive, "Investigator not active");
        
        uint256 investigationId = investigationCounter++;
        
        investigations[investigationId] = Investigation({
            investigationId: FHE.asEuint32(investigationId),
            reportId: FHE.asEuint32(_reportId),
            status: FHE.asEuint32(1), // Started
            priority: _priority,
            isActive: true,
            findingsHash: "",
            investigator: _investigator,
            startTime: block.timestamp,
            endTime: block.timestamp + INVESTIGATION_TIMEOUT
        });
        
        reports[_reportId].assignedInvestigator = _investigator;
        
        emit InvestigationStarted(investigationId, _reportId, _investigator);
    }
    
    function updateInvestigationStatus(
        uint256 _investigationId,
        euint32 _status,
        string memory _findingsHash
    ) external onlyInvestigator {
        require(investigations[_investigationId].investigationId.decrypt() == _investigationId, "Investigation does not exist");
        require(investigations[_investigationId].isActive, "Investigation not active");
        require(investigations[_investigationId].investigator == msg.sender, "Only assigned investigator can update");
        
        investigations[_investigationId].status = _status;
        investigations[_investigationId].findingsHash = _findingsHash;
        
        // If investigation is completed (status 5), mark as inactive
        if (_status.decrypt() == 5) {
            investigations[_investigationId].isActive = false;
            investigations[_investigationId].endTime = block.timestamp;
            
            uint256 reportId = investigations[_investigationId].reportId.decrypt();
            reports[reportId].isProcessed = true;
            
            emit InvestigationCompleted(_investigationId, reportId, true);
        }
    }
    
    function executeComplianceAction(
        uint256 _reportId,
        euint32 _actionType,
        euint32 _severity,
        string memory _actionHash
    ) external onlyComplianceOfficer {
        require(reports[_reportId].reportId.decrypt() == _reportId, "Report does not exist");
        require(reports[_reportId].isProcessed, "Report must be processed first");
        
        uint256 actionId = actionCounter++;
        
        complianceActions[actionId] = ComplianceAction({
            actionId: FHE.asEuint32(actionId),
            reportId: FHE.asEuint32(_reportId),
            actionType: _actionType,
            severity: _severity,
            isExecuted: true,
            actionHash: _actionHash,
            executor: msg.sender,
            timestamp: block.timestamp
        });
        
        emit ComplianceActionExecuted(actionId, _reportId, msg.sender);
    }
    
    function verifyReport(uint256 _reportId, bool _isVerified) external onlyComplianceOfficer {
        require(reports[_reportId].reportId.decrypt() == _reportId, "Report does not exist");
        
        reports[_reportId].isVerified = _isVerified;
        
        // Update reporter's reputation based on verification
        address reporter = reports[_reportId].reporter;
        euint32 currentRep = memberReputation[reporter];
        
        if (_isVerified) {
            // Increase reputation for verified report
            memberReputation[reporter] = currentRep.add(FHE.asEuint32(50));
        } else {
            // Decrease reputation for unverified report
            memberReputation[reporter] = currentRep.sub(FHE.asEuint32(25));
        }
        
        daoMembers[reporter].reputation = memberReputation[reporter];
        
        emit ReportVerified(_reportId, _isVerified);
        emit MemberReputationUpdated(reporter, memberReputation[reporter].decrypt());
    }
    
    function updateInvestigatorRating(address _investigator, euint32 _rating) external onlyComplianceOfficer {
        require(daoMembers[_investigator].isActive, "Investigator not active");
        
        investigatorRating[_investigator] = _rating;
        
        emit InvestigatorRatingUpdated(_investigator, _rating.decrypt());
    }
    
    function getReport(uint256 _reportId) external view returns (
        uint32 reportId,
        uint32 severity,
        uint32 category,
        bool isVerified,
        bool isProcessed,
        string memory reportHash,
        address reporter,
        address assignedInvestigator,
        uint256 timestamp,
        uint256 deadline
    ) {
        WhistleblowerReport memory report = reports[_reportId];
        return (
            report.reportId.decrypt(),
            report.severity.decrypt(),
            report.category.decrypt(),
            report.isVerified,
            report.isProcessed,
            report.reportHash,
            report.reporter,
            report.assignedInvestigator,
            report.timestamp,
            report.deadline
        );
    }
    
    function getInvestigation(uint256 _investigationId) external view returns (
        uint32 investigationId,
        uint32 reportId,
        uint32 status,
        uint32 priority,
        bool isActive,
        string memory findingsHash,
        address investigator,
        uint256 startTime,
        uint256 endTime
    ) {
        Investigation memory investigation = investigations[_investigationId];
        return (
            investigation.investigationId.decrypt(),
            investigation.reportId.decrypt(),
            investigation.status.decrypt(),
            investigation.priority.decrypt(),
            investigation.isActive,
            investigation.findingsHash,
            investigation.investigator,
            investigation.startTime,
            investigation.endTime
        );
    }
    
    function getMemberReputation(address _member) external view returns (uint32) {
        return memberReputation[_member].decrypt();
    }
    
    function getInvestigatorRating(address _investigator) external view returns (uint32) {
        return investigatorRating[_investigator].decrypt();
    }
    
    function isVerifiedMember(address _member) external view returns (bool) {
        return daoMembers[_member].isVerified;
    }
    
    function getTotalReports() external view returns (uint256) {
        return reportCounter;
    }
    
    function getTotalInvestigations() external view returns (uint256) {
        return investigationCounter;
    }
    
    function getTotalActions() external view returns (uint256) {
        return actionCounter;
    }
}
