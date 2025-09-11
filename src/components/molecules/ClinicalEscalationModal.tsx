import React, { useState, useEffect } from 'react';
import { Button, Badge, SmallText, Text, Caption, Label, Select, Input } from '../atoms';
import { useConversationState } from '../../lib/ConversationStateContext';
import { useClinicalIntentDetection } from '../../lib/useClinicalIntentDetection';
import type { UserRole } from '../../types';

interface ClinicalEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEscalate: (escalationData: EscalationData) => void;
  caseId: string;
  userRole: UserRole;
  className?: string;
}

export interface EscalationData {
  reason: EscalationReason;
  customReason?: string;
  priority: EscalationPriority;
  assignTo?: string;
  requiresImmediate: boolean;
  additionalNotes?: string;
  clinicalCategories: string[];
}

export type EscalationReason = 
  | 'clinical-content'
  | 'mental-health-emergency'
  | 'urgent-medical'
  | 'medication-concern'
  | 'liability-risk'
  | 'complex-case'
  | 'policy-violation'
  | 'other';

export type EscalationPriority = 'normal' | 'high' | 'urgent' | 'emergency';

const ESCALATION_REASONS: Record<EscalationReason, { label: string; description: string }> = {
  'clinical-content': {
    label: 'Clinical Content',
    description: 'Response contains medical advice or clinical information'
  },
  'mental-health-emergency': {
    label: 'Mental Health Emergency',
    description: 'Potential self-harm, suicide, or mental health crisis'
  },
  'urgent-medical': {
    label: 'Urgent Medical',
    description: 'Time-sensitive medical situation requiring immediate attention'
  },
  'medication-concern': {
    label: 'Medication Concern',
    description: 'Drug interactions, dosage questions, or prescription issues'
  },
  'liability-risk': {
    label: 'Liability Risk',
    description: 'Response may create legal or professional liability'
  },
  'complex-case': {
    label: 'Complex Case',
    description: 'Multiple medical conditions or complicated patient scenario'
  },
  'policy-violation': {
    label: 'Policy Violation',
    description: 'Response violates organizational policies or guidelines'
  },
  'other': {
    label: 'Other',
    description: 'Other reason requiring clinical escalation'
  }
};

const AVAILABLE_CLINICIANS = [
  { id: 'dr_smith', name: 'Dr. Sarah Smith (General Medicine)', specialty: 'general' },
  { id: 'dr_johnson', name: 'Dr. Michael Johnson (Cardiology)', specialty: 'cardiology' },
  { id: 'dr_williams', name: 'Dr. Emily Williams (Mental Health)', specialty: 'mental-health' },
  { id: 'dr_brown', name: 'Dr. David Brown (Pediatrics)', specialty: 'pediatrics' },
  { id: 'dr_davis', name: 'Dr. Lisa Davis (Emergency Medicine)', specialty: 'emergency' },
  { id: 'supervisor', name: 'Clinical Supervisor', specialty: 'supervision' }
];

const ClinicalEscalationModal: React.FC<ClinicalEscalationModalProps> = ({
  isOpen,
  onClose,
  onEscalate,
  caseId,
  userRole,
  className = ''
}) => {
  const { state, actions } = useConversationState();
  const { currentCaseAnalysis, getCurrentSafetyFlags } = useClinicalIntentDetection();
  
  const [escalationData, setEscalationData] = useState<EscalationData>({
    reason: 'clinical-content',
    priority: 'normal',
    requiresImmediate: false,
    clinicalCategories: currentCaseAnalysis?.detectedCategories || []
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safetyFlags = getCurrentSafetyFlags(userRole);

  // Auto-populate based on clinical analysis
  useEffect(() => {
    if (currentCaseAnalysis && isOpen) {
      const autoReason: EscalationReason = 
        currentCaseAnalysis.detectedCategories.includes('mentalHealth') && currentCaseAnalysis.isUrgent ? 
          'mental-health-emergency' :
        currentCaseAnalysis.isUrgent ? 
          'urgent-medical' :
        currentCaseAnalysis.detectedCategories.length > 0 ? 
          'clinical-content' : 
          'complex-case';

      const autoPriority: EscalationPriority = 
        currentCaseAnalysis.riskLevel === 'critical' ? 'emergency' :
        currentCaseAnalysis.riskLevel === 'high' ? 'urgent' :
        currentCaseAnalysis.riskLevel === 'medium' ? 'high' : 'normal';

      setEscalationData({
        reason: autoReason,
        priority: autoPriority,
        requiresImmediate: currentCaseAnalysis.isUrgent,
        clinicalCategories: currentCaseAnalysis.detectedCategories,
        assignTo: getRecommendedClinician(currentCaseAnalysis.detectedCategories)
      });
    }
  }, [currentCaseAnalysis, isOpen]);

  const getRecommendedClinician = (categories: string[]): string => {
    if (categories.includes('mentalHealth')) return 'dr_williams';
    if (categories.includes('pediatric')) return 'dr_brown';
    if (categories.includes('urgent')) return 'dr_davis';
    return 'supervisor';
  };

  const validateEscalation = (): string[] => {
    const errors: string[] = [];

    if (!escalationData.reason) {
      errors.push('Escalation reason is required');
    }

    if (escalationData.reason === 'other' && !escalationData.customReason?.trim()) {
      errors.push('Custom reason is required when selecting "Other"');
    }

    if (!escalationData.priority) {
      errors.push('Priority level is required');
    }

    if (escalationData.priority === 'emergency' && !escalationData.requiresImmediate) {
      errors.push('Emergency priority requires immediate attention flag');
    }

    if (!escalationData.assignTo) {
      errors.push('Must assign to a clinician or supervisor');
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateEscalation();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      // Update workflow flags
      actions.updateWorkflowFlags({
        isEscalated: true,
        requiresClinicalReview: true,
        clinicalReviewerId: escalationData.assignTo,
        isHighPriority: escalationData.priority === 'urgent' || escalationData.priority === 'emergency'
      });

      // Add audit record
      if (state.currentUser) {
        actions.addEditRecord({
          userId: state.currentUser.id,
          reason: 'other',
          customReason: `Clinical escalation: ${ESCALATION_REASONS[escalationData.reason].label}`,
          originalContent: `Case escalated to ${escalationData.assignTo}`,
          modifiedContent: `Escalation reason: ${escalationData.reason}, Priority: ${escalationData.priority}`,
          conversationId: caseId
        });
      }

      onEscalate(escalationData);
      onClose();
    } catch {
      setValidationErrors(['Failed to escalate case. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in ${className}`}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <Text size="lg" weight="medium" className="text-gray-900">
                Clinical Escalation
              </Text>
              <Caption variant="muted" className="mt-1">
                Escalate case for clinical review and oversight
              </Caption>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Clinical Analysis Summary */}
          {currentCaseAnalysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <SmallText weight="medium" className="text-blue-900 mb-2">
                Clinical Analysis Summary
              </SmallText>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <Caption variant="muted">Risk Level</Caption>
                  <Badge variant={currentCaseAnalysis.riskLevel === 'critical' ? 'error' : 
                                currentCaseAnalysis.riskLevel === 'high' ? 'warning' : 'info'}>
                    {currentCaseAnalysis.riskLevel}
                  </Badge>
                </div>
                <div>
                  <Caption variant="muted">Confidence</Caption>
                  <Caption>{Math.round(currentCaseAnalysis.confidence * 100)}%</Caption>
                </div>
              </div>
              {currentCaseAnalysis.detectedCategories.length > 0 && (
                <div>
                  <Caption variant="muted" className="mb-1">Detected Categories</Caption>
                  <div className="flex flex-wrap gap-1">
                    {currentCaseAnalysis.detectedCategories.map((category, index) => (
                      <Badge key={index} variant="default" size="sm" className="capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Safety Flags Warning */}
          {safetyFlags && (safetyFlags.blockSending || safetyFlags.requiresClinicalReview) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <SmallText weight="medium" className="text-red-900">
                    Clinical Safety Alert
                  </SmallText>
                  <Caption className="text-red-700 mt-1">
                    {safetyFlags.warningMessage}
                  </Caption>
                </div>
              </div>
            </div>
          )}

          {/* Escalation Form */}
          <div className="space-y-4">
            {/* Escalation Reason */}
            <div>
              <Label htmlFor="escalation-reason" className="required">
                Escalation Reason
              </Label>
              <Select
                value={escalationData.reason}
                onValueChange={(value) => setEscalationData({ ...escalationData, reason: value as EscalationReason })}
              >
                <Select.Trigger id="escalation-reason">
                  <Select.Value placeholder="Select escalation reason" />
                </Select.Trigger>
                <Select.Content>
                  {Object.entries(ESCALATION_REASONS).map(([value, { label, description }]) => (
                    <Select.Item key={value} value={value}>
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-sm text-gray-600">{description}</div>
                      </div>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>

            {/* Custom Reason */}
            {escalationData.reason === 'other' && (
              <div>
                <Label htmlFor="custom-reason" className="required">
                  Custom Reason
                </Label>
                <Input
                  id="custom-reason"
                  value={escalationData.customReason || ''}
                  onChange={(e) => setEscalationData({ ...escalationData, customReason: e.target.value })}
                  placeholder="Describe the specific reason for escalation"
                />
              </div>
            )}

            {/* Priority Level */}
            <div>
              <Label htmlFor="priority" className="required">
                Priority Level
              </Label>
              <Select
                value={escalationData.priority}
                onValueChange={(value) => setEscalationData({ ...escalationData, priority: value as EscalationPriority })}
              >
                <Select.Trigger id="priority">
                  <Select.Value placeholder="Select priority level" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="normal">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" size="sm">Normal</Badge>
                      <span>Standard review process</span>
                    </div>
                  </Select.Item>
                  <Select.Item value="high">
                    <div className="flex items-center space-x-2">
                      <Badge variant="info" size="sm">High</Badge>
                      <span>Priority review within 2 hours</span>
                    </div>
                  </Select.Item>
                  <Select.Item value="urgent">
                    <div className="flex items-center space-x-2">
                      <Badge variant="warning" size="sm">Urgent</Badge>
                      <span>Review within 30 minutes</span>
                    </div>
                  </Select.Item>
                  <Select.Item value="emergency">
                    <div className="flex items-center space-x-2">
                      <Badge variant="error" size="sm">Emergency</Badge>
                      <span>Immediate review required</span>
                    </div>
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>

            {/* Assign To */}
            <div>
              <Label htmlFor="assign-to" className="required">
                Assign To
              </Label>
              <Select
                value={escalationData.assignTo || ''}
                onValueChange={(value) => setEscalationData({ ...escalationData, assignTo: value })}
              >
                <Select.Trigger id="assign-to">
                  <Select.Value placeholder="Select clinician or supervisor" />
                </Select.Trigger>
                <Select.Content>
                  {AVAILABLE_CLINICIANS.map((clinician) => (
                    <Select.Item key={clinician.id} value={clinician.id}>
                      <div>
                        <div className="font-medium">{clinician.name}</div>
                        <div className="text-sm text-gray-600 capitalize">{clinician.specialty} specialist</div>
                      </div>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="additional-notes">
                Additional Notes
              </Label>
              <textarea
                id="additional-notes"
                value={escalationData.additionalNotes || ''}
                onChange={(e) => setEscalationData({ ...escalationData, additionalNotes: e.target.value })}
                placeholder="Any additional context or instructions for the reviewing clinician"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Immediate Attention Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="requires-immediate"
                checked={escalationData.requiresImmediate}
                onChange={(e) => setEscalationData({ ...escalationData, requiresImmediate: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="requires-immediate" className="text-sm">
                Requires immediate attention
              </Label>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <SmallText weight="medium" className="text-red-900 mb-2">
                Please correct the following errors:
              </SmallText>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={escalationData.priority === 'emergency' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Escalating...</span>
                </div>
              ) : (
                `Escalate Case (${escalationData.priority.toUpperCase()})`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalEscalationModal;
