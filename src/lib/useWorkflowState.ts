import { useCallback, useEffect } from 'react';
import { useConversationState, type WorkflowFlags } from './ConversationStateContext';
import { useAuditTrail } from './useAuditTrail';
import type { Case, EditReason, UserRole, ResponseMode } from '../types';

// Workflow state management utilities
export interface WorkflowTransition {
  from: ResponseMode;
  to: ResponseMode;
  requiresApproval?: boolean;
  requiresReason?: boolean;
  allowedRoles?: UserRole[];
  validationRules?: string[];
}

export interface WorkflowValidation {
  canTransition: boolean;
  requiredActions: string[];
  blockingFactors: string[];
  warnings: string[];
}

// Predefined workflow transitions
const WORKFLOW_TRANSITIONS: Record<string, WorkflowTransition> = {
  'pending-to-editing': {
    from: 'pending',
    to: 'editing',
    requiresReason: true,
    allowedRoles: ['admin', 'clinician', 'support']
  },
  'editing-to-pending': {
    from: 'editing',
    to: 'pending',
    validationRules: ['content-modified', 'reason-provided']
  },
  'editing-to-resolved': {
    from: 'editing',
    to: 'resolved',
    requiresApproval: true,
    allowedRoles: ['admin', 'clinician'],
    validationRules: ['content-modified', 'reason-provided', 'clinical-review-if-required']
  },
  'pending-to-resolved': {
    from: 'pending',
    to: 'resolved',
    requiresApproval: true,
    allowedRoles: ['admin', 'clinician'],
    validationRules: ['clinical-review-if-required']
  }
};

export const useWorkflowState = () => {
  const { state, actions } = useConversationState();
  const auditTrail = useAuditTrail();

  // Validate workflow transition
  const validateTransition = useCallback((
    to: ResponseMode, 
    reason?: EditReason,
    customReason?: string
  ): WorkflowValidation => {
    const currentMode = state.responseState.mode;
    const currentUser = state.currentUser;
    const transitionKey = `${currentMode}-to-${to}`;
    const transition = WORKFLOW_TRANSITIONS[transitionKey];

    const validation: WorkflowValidation = {
      canTransition: false,
      requiredActions: [],
      blockingFactors: [],
      warnings: []
    };

    // Check if transition exists
    if (!transition) {
      validation.blockingFactors.push(`Invalid transition from ${currentMode} to ${to}`);
      return validation;
    }

    // Check user role permissions
    if (transition.allowedRoles && currentUser) {
      if (!transition.allowedRoles.includes(currentUser.role)) {
        validation.blockingFactors.push(`Role ${currentUser.role} not authorized for this transition`);
      }
    }

    // Check if reason is required
    if (transition.requiresReason && !reason) {
      validation.requiredActions.push('Edit reason must be provided');
    }

    if (reason === 'other' && !customReason) {
      validation.requiredActions.push('Custom reason required when selecting "Other"');
    }

    // Validate business rules
    if (transition.validationRules) {
      transition.validationRules.forEach(rule => {
        switch (rule) {
          case 'content-modified':
            if (state.responseState.originalContent === state.responseState.currentContent) {
              validation.requiredActions.push('Content must be modified before saving');
            }
            break;

          case 'reason-provided':
            if (!reason) {
              validation.requiredActions.push('Edit reason must be provided');
            }
            break;

          case 'clinical-review-if-required':
            if (state.workflowFlags.requiresClinicalReview && !state.workflowFlags.clinicalReviewerId) {
              validation.requiredActions.push('Clinical review required before approval');
            }
            break;
        }
      });
    }

    // Check for escalation requirements
    if (state.workflowFlags.requiresClinicalReview && currentUser?.role === 'support') {
      validation.blockingFactors.push('Clinical cases require clinician or admin approval');
    }

    // Check for approval requirements
    if (transition.requiresApproval && to === 'resolved') {
      if (!currentUser || !['admin', 'clinician'].includes(currentUser.role)) {
        validation.blockingFactors.push('Response approval requires admin or clinician role');
      }
    }

    // Add warnings for audit concerns
    if (auditTrail.auditSummary.totalEdits > 5) {
      validation.warnings.push('High number of edits may require additional review');
    }

    if (state.workflowFlags.isHighPriority && !state.workflowFlags.supervisorAssigned) {
      validation.warnings.push('High priority case should have supervisor oversight');
    }

    // Set final validation result
    validation.canTransition = validation.blockingFactors.length === 0 && 
                              validation.requiredActions.length === 0;

    return validation;
  }, [state.responseState, state.currentUser, state.workflowFlags, auditTrail.auditSummary]);

  // Execute workflow transition
  const executeTransition = useCallback(async (
    to: ResponseMode,
    reason?: EditReason,
    customReason?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const validation = validateTransition(to, reason, customReason);

    if (!validation.canTransition) {
      return {
        success: false,
        error: validation.blockingFactors[0] || validation.requiredActions[0] || 'Transition not allowed'
      };
    }

    try {
      // Record edit if content was modified
      if (reason && state.responseState.isModified && state.currentUser) {
        actions.addEditRecord({
          userId: state.currentUser.id,
          reason,
          customReason,
          originalContent: state.responseState.originalContent,
          modifiedContent: state.responseState.currentContent,
          conversationId: state.activeConversation?.id || ''
        });
      }

      // Update response state
      actions.updateResponseState({ mode: to });

      // Update workflow flags based on transition
      const flagUpdates: Partial<WorkflowFlags> = {};

      if (to === 'resolved') {
        flagUpdates.hasPendingApproval = false;
      }

      if (to === 'editing') {
        flagUpdates.hasPendingApproval = true;
      }

      if (Object.keys(flagUpdates).length > 0) {
        actions.updateWorkflowFlags(flagUpdates);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }, [validateTransition, state.responseState, state.currentUser, state.activeConversation, actions]);

  // Get available transitions for current state
  const getAvailableTransitions = useCallback((): Array<{
    to: ResponseMode;
    label: string;
    description: string;
    validation: WorkflowValidation;
  }> => {
    const currentMode = state.responseState.mode;
    const transitions = [];

    const transitionLabels: Record<string, { label: string; description: string }> = {
      'pending-to-editing': {
        label: 'Edit Response',
        description: 'Modify the AI-generated response'
      },
      'editing-to-pending': {
        label: 'Save Draft',
        description: 'Save changes and return to draft state'
      },
      'editing-to-resolved': {
        label: 'Approve & Send',
        description: 'Approve the edited response and send to patient'
      },
      'pending-to-resolved': {
        label: 'Approve & Send',
        description: 'Approve the response as-is and send to patient'
      }
    };

    Object.entries(WORKFLOW_TRANSITIONS).forEach(([key, transition]) => {
      if (transition.from === currentMode) {
        const validation = validateTransition(transition.to);
        const labels = transitionLabels[key];
        
        if (labels) {
          transitions.push({
            to: transition.to,
            label: labels.label,
            description: labels.description,
            validation
          });
        }
      }
    });

    return transitions;
  }, [state.responseState.mode, validateTransition]);

  // Auto-escalation logic
  const checkAutoEscalation = useCallback(() => {
    const activeConversation = state.activeConversation;
    const workflowFlags = state.workflowFlags;

    if (!activeConversation) return;

    const escalationReasons: string[] = [];

    // High priority cases
    if (activeConversation.priority === 'critical' && !workflowFlags.supervisorAssigned) {
      escalationReasons.push('Critical priority case requires supervisor oversight');
    }

    // Clinical cases without review
    if (activeConversation.category === 'clinical' && !workflowFlags.clinicalReviewerId) {
      escalationReasons.push('Clinical case requires clinical reviewer assignment');
    }

    // Too many edits
    if (auditTrail.auditSummary.totalEdits > 10) {
      escalationReasons.push('Excessive editing history requires review');
    }

    // Response time exceeded
    const hoursSinceCreated = (Date.now() - activeConversation.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreated > 24 && state.responseState.mode !== 'resolved') {
      escalationReasons.push('Response time SLA exceeded');
    }

    return escalationReasons;
  }, [state.activeConversation, state.workflowFlags, state.responseState.mode, auditTrail.auditSummary]);

  // Auto-escalation effect
  useEffect(() => {
    const escalationReasons = checkAutoEscalation();
    
    if (escalationReasons.length > 0 && !state.workflowFlags.isEscalated) {
      actions.updateWorkflowFlags({
        isEscalated: true,
        isAuditRequired: true
      });
    }
  }, [checkAutoEscalation, state.workflowFlags.isEscalated, actions]);

  // Workflow status helpers
  const getWorkflowStatus = useCallback(() => {
    const workflowFlags = state.workflowFlags;
    const responseState = state.responseState;

    return {
      isBlocked: workflowFlags.requiresClinicalReview && !workflowFlags.clinicalReviewerId,
      needsApproval: workflowFlags.hasPendingApproval,
      isEscalated: workflowFlags.isEscalated,
      isHighPriority: workflowFlags.isHighPriority,
      canApprove: state.currentUser && ['admin', 'clinician'].includes(state.currentUser.role),
      canEdit: state.currentUser && ['admin', 'clinician', 'support'].includes(state.currentUser.role),
      autoEscalationReasons: checkAutoEscalation()
    };
  }, [state.workflowFlags, state.responseState, state.currentUser, checkAutoEscalation]);

  return {
    // Current state
    currentMode: state.responseState.mode,
    workflowFlags: state.workflowFlags,
    
    // Transition management
    validateTransition,
    executeTransition,
    getAvailableTransitions,
    
    // Status helpers
    getWorkflowStatus,
    checkAutoEscalation,
    
    // Computed properties
    isInEditMode: state.responseState.mode === 'editing',
    isResolved: state.responseState.mode === 'resolved',
    isPending: state.responseState.mode === 'pending',
    
    // Audit integration
    auditSummary: auditTrail.auditSummary,
    isAuditRequired: auditTrail.isAuditRequired(),
    isCompliant: auditTrail.isCompliant
  };
};

export default useWorkflowState;
