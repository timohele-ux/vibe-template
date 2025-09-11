import { useCallback, useMemo } from 'react';
import { useConversationState } from './ConversationStateContext';
import type { EditRecord, EditReason, UserRole } from '../types';

// Audit trail analysis and reporting utilities
export interface AuditSummary {
  totalEdits: number;
  lastEdit?: Date;
  editReasons: EditReason[];
  uniqueEditors: string[];
  isAuditRequired: boolean;
  hasEscalations: boolean;
  complianceFlags: {
    hasRequiredReasons: boolean;
    withinTimeWindows: boolean;
    properApprovals: boolean;
  };
}

export interface AuditReport {
  conversationId: string;
  summary: AuditSummary;
  timeline: EditRecord[];
  riskFactors: string[];
  recommendations: string[];
  exportData: () => string; // CSV format
}

export const useAuditTrail = () => {
  const { state } = useConversationState();

  // Generate comprehensive audit summary
  const auditSummary = useMemo((): AuditSummary => {
    const editHistory = state.editHistory;
    const workflowFlags = state.workflowFlags;

    const uniqueEditors = [...new Set(editHistory.map(record => record.userId))];
    const editReasons = [...new Set(editHistory.map(record => record.reason))];
    
    // Compliance checks
    const hasRequiredReasons = editHistory.every(record => 
      record.reason !== 'other' || (record.reason === 'other' && record.customReason)
    );
    
    const withinTimeWindows = editHistory.every(record => {
      const hoursSinceEdit = (Date.now() - record.timestamp.getTime()) / (1000 * 60 * 60);
      return hoursSinceEdit <= 24; // 24-hour edit window for compliance
    });

    const properApprovals = !workflowFlags.requiresClinicalReview || 
      (workflowFlags.clinicalReviewerId && !workflowFlags.hasPendingApproval);

    return {
      totalEdits: editHistory.length,
      lastEdit: editHistory[editHistory.length - 1]?.timestamp,
      editReasons,
      uniqueEditors,
      isAuditRequired: workflowFlags.isAuditRequired,
      hasEscalations: workflowFlags.isEscalated,
      complianceFlags: {
        hasRequiredReasons,
        withinTimeWindows,
        properApprovals
      }
    };
  }, [state.editHistory, state.workflowFlags]);

  // Get edits by specific user
  const getEditsByUser = useCallback((userId: string): EditRecord[] => {
    return state.editHistory.filter(record => record.userId === userId);
  }, [state.editHistory]);

  // Get edits by reason
  const getEditsByReason = useCallback((reason: EditReason): EditRecord[] => {
    return state.editHistory.filter(record => record.reason === reason);
  }, [state.editHistory]);

  // Get edits within time range
  const getEditsInTimeRange = useCallback((startTime: Date, endTime: Date): EditRecord[] => {
    return state.editHistory.filter(record => 
      record.timestamp >= startTime && record.timestamp <= endTime
    );
  }, [state.editHistory]);

  // Analyze edit patterns for risk assessment
  const analyzeEditPatterns = useCallback(() => {
    const editHistory = state.editHistory;
    const riskFactors: string[] = [];
    
    // Too many edits in short time
    const recentEdits = editHistory.filter(record => {
      const hoursSince = (Date.now() - record.timestamp.getTime()) / (1000 * 60 * 60);
      return hoursSince <= 1;
    });
    if (recentEdits.length > 5) {
      riskFactors.push('Excessive edits in the last hour');
    }

    // Multiple editors on same response
    const uniqueEditors = new Set(editHistory.map(record => record.userId));
    if (uniqueEditors.size > 3) {
      riskFactors.push('Multiple editors modifying response');
    }

    // High proportion of "other" edit reasons
    const otherEdits = editHistory.filter(record => record.reason === 'other');
    if (otherEdits.length / editHistory.length > 0.3) {
      riskFactors.push('High proportion of unspecified edit reasons');
    }

    return riskFactors;
  }, [state.editHistory]);

  // Generate compliance recommendations
  const getComplianceRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    const { complianceFlags } = auditSummary;

    if (!complianceFlags.hasRequiredReasons) {
      recommendations.push('Ensure all edits have specific reasons documented');
    }

    if (!complianceFlags.withinTimeWindows) {
      recommendations.push('Review edit timestamps for compliance with 24-hour window');
    }

    if (!complianceFlags.properApprovals) {
      recommendations.push('Clinical review required before response approval');
    }

    if (state.workflowFlags.isHighPriority && !state.workflowFlags.supervisorAssigned) {
      recommendations.push('High priority case should have supervisor oversight');
    }

    if (auditSummary.totalEdits > 10) {
      recommendations.push('Consider escalation due to extensive editing history');
    }

    return recommendations;
  }, [auditSummary, state.workflowFlags]);

  // Generate full audit report
  const generateAuditReport = useCallback((): AuditReport => {
    const conversationId = state.activeConversation?.id || 'unknown';
    const timeline = [...state.editHistory].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    const riskFactors = analyzeEditPatterns();
    const recommendations = getComplianceRecommendations();

    const exportData = () => {
      const headers = ['Timestamp', 'User ID', 'Edit Reason', 'Custom Reason', 'Content Length Change'];
      const rows = timeline.map(record => [
        record.timestamp.toISOString(),
        record.userId,
        record.reason,
        record.customReason || '',
        (record.modifiedContent.length - record.originalContent.length).toString()
      ]);

      return [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    };

    return {
      conversationId,
      summary: auditSummary,
      timeline,
      riskFactors,
      recommendations,
      exportData
    };
  }, [state.activeConversation, state.editHistory, auditSummary, analyzeEditPatterns, getComplianceRecommendations]);

  // Validate edit compliance
  const validateEditCompliance = useCallback((editRecord: Partial<EditRecord>): { 
    isValid: boolean; 
    errors: string[]; 
  } => {
    const errors: string[] = [];

    if (!editRecord.reason) {
      errors.push('Edit reason is required');
    }

    if (editRecord.reason === 'other' && !editRecord.customReason) {
      errors.push('Custom reason required when selecting "Other"');
    }

    if (!editRecord.originalContent || !editRecord.modifiedContent) {
      errors.push('Both original and modified content are required');
    }

    if (editRecord.originalContent === editRecord.modifiedContent) {
      errors.push('No changes detected between original and modified content');
    }

    // Check if edit is within allowed time window
    const lastEdit = state.editHistory[state.editHistory.length - 1];
    if (lastEdit) {
      const timeSinceLastEdit = Date.now() - lastEdit.timestamp.getTime();
      const hoursSinceLastEdit = timeSinceLastEdit / (1000 * 60 * 60);
      
      if (hoursSinceLastEdit < 0.1) { // 6 minutes minimum between edits
        errors.push('Minimum time between edits not met');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [state.editHistory]);

  // Check if audit is required
  const isAuditRequired = useCallback((): boolean => {
    return (
      state.workflowFlags.isAuditRequired ||
      state.workflowFlags.isEscalated ||
      state.workflowFlags.requiresClinicalReview ||
      auditSummary.totalEdits >= 5 ||
      analyzeEditPatterns().length > 0
    );
  }, [state.workflowFlags, auditSummary.totalEdits, analyzeEditPatterns]);

  return {
    // Data access
    editHistory: state.editHistory,
    auditSummary,
    
    // Query functions
    getEditsByUser,
    getEditsByReason,
    getEditsInTimeRange,
    
    // Analysis functions
    analyzeEditPatterns,
    getComplianceRecommendations,
    generateAuditReport,
    validateEditCompliance,
    isAuditRequired,
    
    // Computed flags
    hasEditHistory: state.editHistory.length > 0,
    requiresReview: state.workflowFlags.requiresClinicalReview,
    isCompliant: auditSummary.complianceFlags.hasRequiredReasons && 
                 auditSummary.complianceFlags.withinTimeWindows &&
                 auditSummary.complianceFlags.properApprovals
  };
};

export default useAuditTrail;
