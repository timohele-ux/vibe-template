import React, { useState, useEffect } from 'react';
import { Button, Badge, PriorityTag, StatusIndicator, Avatar, Heading2, Heading3, BodyText, SmallText, Caption, Tabs, Toggle, Separator } from '../atoms';
import { 
  ConversationThread, 
  MessageComposer, 
  AIResponseDraft, 
  BatchModeToggle, 
  BatchActions,
  PatientMessageCard,
  ClinicalEscalationModal,
  SuggestedResources,
  ResponseActionButtons
} from '../molecules';
import { getResourcesByContext } from '../../mockData';
import { useConversationState } from '../../lib/ConversationStateContext';
import { useWorkflowState } from '../../lib/useWorkflowState';
import { useClinicalIntentDetection } from '../../lib/useClinicalIntentDetection';
import type { Case, User, Message, AIResponse, EditReason, SuggestedResource } from '../../types';
import type { EscalationData } from '../molecules';

interface ActiveCasePanelProps {
  activeCase: Case | null;
  currentUser: User;
  onSendMessage: (caseId: string, content: string, isDraft?: boolean) => void;
  onApproveAIResponse: (caseId: string, responseId: string, modifications?: string[]) => void;
  onRejectAIResponse: (caseId: string, responseId: string, reason: string) => void;
  onEditAIResponse: (caseId: string, responseId: string, newContent: string, editReason: string, customReason?: string) => void;
  onRequestAISuggestion: (caseId: string) => void;
  onBatchAction: (caseId: string, action: string, responseIds: string[], reason?: string) => void;
  onUpdateCaseStatus: (caseId: string, status: Case['status']) => void;
  onEscalateCase: (caseId: string, escalationData: EscalationData) => void;
  isLoading?: boolean;
  className?: string;
}

const ActiveCasePanel: React.FC<ActiveCasePanelProps> = ({
  activeCase,
  currentUser,
  onSendMessage,
  onApproveAIResponse,
  onRejectAIResponse,
  onEditAIResponse,
  onRequestAISuggestion,
  onBatchAction,
  onUpdateCaseStatus,
  onEscalateCase,
  isLoading = false,
  className = ''
}) => {
  const [batchMode, setBatchMode] = useState(false);
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  const [aiSuggestion, setAISuggestion] = useState<AIResponse | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Phase 6: Workflow State Management Integration
  const { state, actions } = useConversationState();
  const workflowState = useWorkflowState();
  
  // Phase 7: Clinical Safety & Escalation Integration
  const clinicalDetection = useClinicalIntentDetection();

  // Initialize conversation state when case changes
  useEffect(() => {
    if (activeCase) {
      actions.setActiveConversation(activeCase);
      
      // Set up workflow flags based on case properties
      actions.updateWorkflowFlags({
        requiresClinicalReview: activeCase.category === 'clinical' || activeCase.priority === 'critical',
        isHighPriority: activeCase.priority === 'critical' || activeCase.priority === 'urgent',
        lastActivity: new Date()
      });

      // Generate suggested resources based on context
      const resources = getResourcesByContext(activeCase.category, activeCase.patient.medicalInfo.conditions);
      actions.setSuggestedResources(resources);
      
      // Phase 7: Analyze case content for clinical intent
      const allMessages = activeCase.messages || [];
      if (allMessages.length > 0) {
        const combinedContent = allMessages.map(msg => msg.content).join(' ');
        clinicalDetection.analyzeContent(combinedContent);
      }
    }
  }, [activeCase, actions, clinicalDetection]);

    // Enhanced edit handler with audit trail
  const handleEnhancedEdit = (responseId: string, content: string, editReason: EditReason, customReason?: string) => {
    if (!activeCase) return;

    // Use workflow state management
    const validation = workflowState.validateTransition('editing', editReason, customReason);
    
    if (!validation.canTransition) {
      console.error('Edit validation failed:', validation.blockingFactors);
      return;
    }

    // Perform the edit
    onEditAIResponse(activeCase.id, responseId, content, editReason, customReason);
    
    // The edit record is automatically added through the context
  };

  // Reset batch mode when case changes
  useEffect(() => {
    setBatchMode(false);
    setSelectedResponses([]);
    setAISuggestion(null);
  }, [activeCase?.id]);

  const handleSendMessage = (content: string, isDraft?: boolean) => {
    if (activeCase) {
      onSendMessage(activeCase.id, content, isDraft);
    }
  };

  const handleRequestAISuggestion = () => {
    if (activeCase) {
      setIsGeneratingAI(true);
      try {
        onRequestAISuggestion(activeCase.id);
        // In a real implementation, this would come from the parent component
        // For now, we'll simulate an AI response
        setTimeout(() => {
          setAISuggestion({
            id: `ai-${Date.now()}`,
            caseId: activeCase.id,
            content: `Thank you for reaching out about your appointment concern. I understand your frustration with the scheduling change. Let me help you find an alternative appointment that works better for your schedule. I'll check our availability for the next few days and get back to you within the hour with options.`,
            confidence: 'high',
            confidenceScore: 92,
            clinicalReasoning: 'High confidence response addressing appointment scheduling with empathetic tone. Standard protocol for non-urgent scheduling concerns.',
            suggestedActions: ['Schedule follow-up', 'Check provider availability', 'Send confirmation'],
            riskAssessment: {
              level: 'low',
              factors: ['Non-urgent administrative request', 'Standard scheduling concern']
            },
            generatedAt: new Date(),
            isApproved: false
          });
          setIsGeneratingAI(false);
        }, 2000);
      } catch (error) {
        setIsGeneratingAI(false);
      }
    }
  };

  const handleBatchToggle = (enabled: boolean) => {
    setBatchMode(enabled);
    if (!enabled) {
      setSelectedResponses([]);
    }
  };

  const handleSelectAllResponses = () => {
    if (activeCase) {
      setSelectedResponses(activeCase.aiResponses.map(r => r.id));
    }
  };

  const handleDeselectAllResponses = () => {
    setSelectedResponses([]);
  };

  const handleBatchAction = (action: string, reason?: string) => {
    if (activeCase && selectedResponses.length > 0) {
      onBatchAction(activeCase.id, action, selectedResponses, reason);
      setSelectedResponses([]);
    }
  };

  const handleEscalateCase = (escalationData: EscalationData) => {
    if (activeCase) {
      onEscalateCase(activeCase.id, escalationData);
      setShowEscalationModal(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!activeCase) {
    return (
      <div className={`flex flex-col items-center justify-center h-full bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <Heading3 className="text-gray-900 mb-2">No Case Selected</Heading3>
          <BodyText className="text-gray-500 max-w-sm">
            Select a patient case from the queue to view conversation history and manage AI responses
          </BodyText>
        </div>
      </div>
    );
  }

  const pendingAIResponses = activeCase.aiResponses.filter(response => !response.isApproved);
  const approvedAIResponses = activeCase.aiResponses.filter(response => response.isApproved);

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Simplified Case Header with Keyboard Navigation */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar
              fallback={`${activeCase.patient.firstName[0]}${activeCase.patient.lastName[0]}`}
              size="md"
              userType="patient"
            />
            <div>
              <Heading2 className="text-gray-900">
                {activeCase.patient.firstName} {activeCase.patient.lastName}
              </Heading2>
              <Caption variant="muted">
                Last message {formatTimeAgo(activeCase.updatedAt)}
              </Caption>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Phase 6: Workflow Status Indicators */}
            {workflowState.isAuditRequired && (
              <Badge variant="warning" className="text-xs">
                Audit Required
              </Badge>
            )}
            {state.workflowFlags.requiresClinicalReview && (
              <Badge variant="info" className="text-xs">
                Clinical Review
              </Badge>
            )}
            {state.workflowFlags.isEscalated && (
              <Badge variant="error" className="text-xs">
                Escalated
              </Badge>
            )}
            
            {/* Phase 7: Clinical Safety Indicators */}
            {(() => {
              const safetyFlags = clinicalDetection.getCurrentSafetyFlags(currentUser.role);
              const analysis = clinicalDetection.currentCaseAnalysis;
              
              return (
                <>
                  {analysis?.isClinical && (
                    <Badge variant="info" className="text-xs">
                      Clinical Content
                    </Badge>
                  )}
                  {analysis?.riskLevel === 'high' && (
                    <Badge variant="warning" className="text-xs">
                      High Risk
                    </Badge>
                  )}
                  {analysis?.riskLevel === 'critical' && (
                    <Badge variant="error" className="text-xs">
                      Critical Risk
                    </Badge>
                  )}
                  {safetyFlags?.blockSending && (
                    <Badge variant="error" className="text-xs">
                      Blocked
                    </Badge>
                  )}
                  {safetyFlags?.requiresSupervisorApproval && (
                    <Badge variant="warning" className="text-xs">
                      Supervisor Required
                    </Badge>
                  )}
                </>
              );
            })()}
            
            {state.editHistory.length > 0 && (
              <Badge variant="default" className="text-xs">
                {state.editHistory.length} Edit{state.editHistory.length !== 1 ? 's' : ''}
              </Badge>
            )}

            <Toggle
              pressed={showDetails}
              onPressedChange={setShowDetails}
              size="sm"
            />
            <SmallText variant="muted">Details</SmallText>
          </div>
        </div>

        {/* Collapsible Details Section */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Tabs defaultValue="case-info">
              <Tabs.List>
                <Tabs.Trigger value="case-info">Case Info</Tabs.Trigger>
                <Tabs.Trigger value="patient-info">Patient Info</Tabs.Trigger>
                <Tabs.Trigger value="audit-trail">Audit Trail</Tabs.Trigger>
                <Tabs.Trigger value="actions">Actions</Tabs.Trigger>
              </Tabs.List>
              
              <Tabs.Content value="case-info">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <StatusIndicator status={activeCase.status} size="sm" />
                    <PriorityTag priority={activeCase.priority} size="sm" />
                  </div>
                  <BodyText className="text-gray-600">{activeCase.subject}</BodyText>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <SmallText weight="medium" className="text-gray-700">Created</SmallText>
                      <Caption variant="muted">{formatTimeAgo(activeCase.createdAt)}</Caption>
                    </div>
                    <div>
                      <SmallText weight="medium" className="text-gray-700">Category</SmallText>
                      <Caption variant="muted">{activeCase.category}</Caption>
                    </div>
                  </div>
                </div>
              </Tabs.Content>
              
              <Tabs.Content value="patient-info">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <SmallText weight="medium" className="text-gray-700">Email</SmallText>
                      <Caption variant="muted">{activeCase.patient.email || 'Not provided'}</Caption>
                    </div>
                    <div>
                      <SmallText weight="medium" className="text-gray-700">Phone</SmallText>
                      <Caption variant="muted">{activeCase.patient.phone || 'Not provided'}</Caption>
                    </div>
                  </div>
                  {activeCase.patient.riskFlags.length > 0 && (
                    <div>
                      <SmallText weight="medium" className="text-gray-700 mb-1">Risk Flags</SmallText>
                      <div className="flex flex-wrap gap-1">
                        {activeCase.patient.riskFlags.map((flag, index) => (
                          <Badge key={index} variant="warning" size="sm">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Tabs.Content>
              
              <Tabs.Content value="audit-trail">
                <div className="space-y-3">
                  {state.editHistory.length > 0 ? (
                    <div className="space-y-2">
                      <SmallText weight="medium" className="text-gray-700">
                        Edit History ({state.editHistory.length} edits)
                      </SmallText>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {state.editHistory.slice().reverse().map((edit, index) => (
                          <div key={edit.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant={edit.reason === 'other' ? 'warning' : 'default'} size="sm">
                                {edit.reason.replace('-', ' ')}
                              </Badge>
                              <Caption variant="muted">
                                {formatTimeAgo(edit.timestamp)}
                              </Caption>
                            </div>
                            {edit.customReason && (
                              <Caption className="text-gray-600 mb-1">
                                {edit.customReason}
                              </Caption>
                            )}
                            <Caption variant="muted">
                              User: {edit.userId} • Content: {edit.modifiedContent.length} chars
                            </Caption>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Caption variant="muted">No edits recorded</Caption>
                    </div>
                  )}
                  
                  {/* Workflow Status Summary */}
                  <div className="pt-3 border-t border-gray-100">
                    <SmallText weight="medium" className="text-gray-700 mb-2">
                      Workflow Status
                    </SmallText>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Caption variant="muted">Current Mode</Caption>
                        <Badge variant={workflowState.currentMode === 'resolved' ? 'success' : 'default'}>
                          {workflowState.currentMode}
                        </Badge>
                      </div>
                      <div>
                        <Caption variant="muted">Last Activity</Caption>
                        <Caption>{formatTimeAgo(state.workflowFlags.lastActivity)}</Caption>
                      </div>
                    </div>
                    
                    {workflowState.isAuditRequired && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Caption className="text-yellow-800">
                          <strong>Audit Required:</strong> This case requires audit trail review due to extensive editing or escalation.
                        </Caption>
                      </div>
                    )}
                  </div>
                </div>
              </Tabs.Content>
              
              <Tabs.Content value="actions">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEscalationModal(true)}
                    disabled={isLoading}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    Escalate
                  </Button>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onUpdateCaseStatus(activeCase.id, 'resolved')}
                    disabled={isLoading || activeCase.status === 'resolved'}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Resolve
                  </Button>
                </div>
              </Tabs.Content>
            </Tabs>
          </div>
        )}

        {/* Batch Mode Toggle */}
        {pendingAIResponses.length > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <BatchModeToggle
              isEnabled={batchMode}
              onToggle={handleBatchToggle}
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      {/* Content Area - Phase 8: Middle Panel Integration */}
      <div id="main-content" className="flex-1 flex flex-col min-h-0" role="main" aria-label="Case details and response management">
        {/* Batch Actions */}
        {batchMode && pendingAIResponses.length > 0 && (
          <div className="flex-shrink-0 p-4 border-b border-gray-200">
            <BatchActions
              selectedCount={selectedResponses.length}
              totalCount={pendingAIResponses.length}
              onSelectAll={handleSelectAllResponses}
              onDeselectAll={handleDeselectAllResponses}
              onBatchAction={handleBatchAction}
              isProcessing={isLoading}
            />
          </div>
        )}

        {/* Phase 8: Structured Middle Panel Layout with Progressive Enhancement */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* 1. Patient Message Card - Responsive */}
          {activeCase.messages.filter(msg => msg.senderType === 'patient').length > 0 && (
            <>
              <div className="p-3 sm:p-4">
                <PatientMessageCard
                  message={activeCase.messages.filter(msg => msg.senderType === 'patient').slice(-1)[0]}
                  patient={activeCase.patient}
                />
              </div>
              <Separator className="mx-3 sm:mx-4" />
            </>
          )}
          
          {/* 2. AI Response Draft Section - Progressive Enhancement */}
          {pendingAIResponses.length > 0 && (
            <>
              <div className="p-3 sm:p-4">
                <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Heading3 className="text-gray-900 text-lg sm:text-xl">
                    AI Response ({pendingAIResponses.length} pending)
                  </Heading3>
                  {!batchMode && (
                    <Badge variant="warning" size="sm">
                      Requires Review
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  {pendingAIResponses.map((response, index) => (
                    <div key={response.id} className="relative">
                      {batchMode && (
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedResponses.includes(response.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedResponses([...selectedResponses, response.id]);
                              } else {
                                setSelectedResponses(selectedResponses.filter(id => id !== response.id));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 sm:w-5 sm:h-5"
                          />
                        </div>
                      )}
                      
                      {/* AI Response Draft with Mobile Optimizations */}
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <AIResponseDraft
                          aiResponse={response}
                          onApprove={(id, modifications) => onApproveAIResponse(activeCase.id, id, modifications)}
                          onReject={(id, reason) => onRejectAIResponse(activeCase.id, id, reason)}
                          onEdit={(id, content, editReason, customReason) => handleEnhancedEdit(id, content, editReason, customReason)}
                          suggestedResources={getResourcesByContext(activeCase.category, activeCase.patient.medicalInfo.conditions)}
                          onResourceClick={(resource) => {
                            console.log('Resource clicked:', resource);
                            window.open(resource.url, '_blank', 'noopener,noreferrer');
                          }}
                          userRole={currentUser.role}
                          canApprove={true}
                          canEscalate={true}
                          isClinicalCase={activeCase.category === 'clinical' || activeCase.priority === 'critical'}
                          onForwardSupervisor={() => {
                            console.log('Forward case to supervisor:', activeCase.id);
                          }}
                          onRequestReview={() => {
                            console.log('Request clinical review:', activeCase.id);
                          }}
                          isLoading={isLoading}
                          className={batchMode ? 'ml-6 sm:ml-8' : ''}
                        />
                        
                        {/* 3. Suggested Resources - Collapsible on Mobile */}
                        <div className="border-t border-gray-100">
                          <details className="sm:open" open>
                            <summary 
                              className="p-3 sm:p-4 cursor-pointer sm:pointer-events-none select-none sm:select-auto"
                              aria-label="Toggle resources and actions section"
                            >
                              <span className="text-sm font-medium text-gray-700 sm:hidden">
                                Resources & Actions
                              </span>
                            </summary>
                            
                            <div className="px-3 pb-3 sm:p-4 sm:pt-0 space-y-3">
                              {/* Suggested Resources */}
                              <SuggestedResources
                                resources={getResourcesByContext(activeCase.category, activeCase.patient.medicalInfo.conditions)}
                                onResourceClick={(resource) => {
                                  console.log('Resource clicked:', resource);
                                  window.open(resource.url, '_blank', 'noopener,noreferrer');
                                }}
                              />
                              
                              {/* 4. Response Action Buttons - Touch-Friendly */}
                              <ResponseActionButtons
                                responseMode="pending"
                                onApprove={() => onApproveAIResponse(activeCase.id, response.id)}
                                onEdit={() => {
                                  console.log('Edit response:', response.id);
                                }}
                                onEscalate={() => setShowEscalationModal(true)}
                                onSaveDraft={() => {
                                  console.log('Save draft:', response.id);
                                }}
                                onForwardSupervisor={() => {
                                  console.log('Forward to supervisor:', response.id);
                                }}
                                onRequestReview={() => {
                                  console.log('Request clinical review:', response.id);
                                }}
                                canApprove={true}
                                canEscalate={true}
                                isClinicalCase={activeCase.category === 'clinical'}
                                userRole={currentUser.role}
                              />
                            </div>
                          </details>
                        </div>
                      </div>
                      
                      {/* Separator between responses - Hidden on mobile for compactness */}
                      {index < pendingAIResponses.length - 1 && (
                        <Separator className="my-4 sm:my-6 hidden sm:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="mx-3 sm:mx-4" />
            </>
          )}
          
          {/* 5. Conversation History - Collapsible on Mobile */}
          <div className="flex-1 p-3 sm:p-4">
            <details className="h-full flex flex-col" open>
              <summary 
                className="mb-3 cursor-pointer sm:pointer-events-none select-none sm:select-auto"
                aria-label="Toggle conversation history section"
              >
                <Heading3 className="text-gray-900 text-lg sm:text-xl inline">
                  Conversation History
                </Heading3>
                <span className="ml-2 text-sm text-gray-500 sm:hidden">
                  (Tap to expand)
                </span>
              </summary>
              
              <div className="flex-1 min-h-0">
                <ConversationThread
                  messages={activeCase.messages}
                  aiResponses={approvedAIResponses}
                />
              </div>
            </details>
          </div>
        </div>

        {/* Message Composer */}
        <div className="flex-shrink-0">
          <MessageComposer
            onSend={handleSendMessage}
            onRequestAISuggestion={handleRequestAISuggestion}
            aiSuggestion={aiSuggestion}
            isLoading={isGeneratingAI}
            placeholder={`Reply to ${activeCase.patient.firstName}...`}
          />
        </div>
      </div>

      {/* Phase 7: Clinical Escalation Modal */}
      <ClinicalEscalationModal
        isOpen={showEscalationModal}
        onClose={() => setShowEscalationModal(false)}
        onEscalate={handleEscalateCase}
        caseId={activeCase?.id || ''}
        userRole={currentUser.role}
      />
    </div>
  );
};

export default ActiveCasePanel;
