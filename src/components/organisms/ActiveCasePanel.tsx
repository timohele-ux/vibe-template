import React, { useState, useEffect } from 'react';
import { Button, Badge, PriorityTag, StatusIndicator, Avatar, Heading2, Heading3, BodyText, SmallText } from '../atoms';
import { 
  ConversationThread, 
  MessageComposer, 
  AIResponseDraft, 
  BatchModeToggle, 
  BatchActions 
} from '../molecules';
import type { Case, AIResponse, Message } from '../../types';

interface ActiveCasePanelProps {
  activeCase: Case | null;
  onSendMessage: (caseId: string, content: string, isDraft?: boolean) => void;
  onApproveAIResponse: (caseId: string, responseId: string, modifications?: string[]) => void;
  onRejectAIResponse: (caseId: string, responseId: string, reason: string) => void;
  onEditAIResponse: (caseId: string, responseId: string, newContent: string) => void;
  onRequestAISuggestion: (caseId: string) => void;
  onBatchAction: (caseId: string, action: string, responseIds: string[], reason?: string) => void;
  onUpdateCaseStatus: (caseId: string, status: Case['status']) => void;
  onEscalateCase: (caseId: string, reason: string) => void;
  isLoading?: boolean;
  className?: string;
}

const ActiveCasePanel: React.FC<ActiveCasePanelProps> = ({
  activeCase,
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
  const [escalationReason, setEscalationReason] = useState('');

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

  const handleRequestAISuggestion = async () => {
    if (activeCase) {
      setIsGeneratingAI(true);
      try {
        await onRequestAISuggestion(activeCase.id);
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

  const handleEscalateCase = () => {
    if (activeCase && escalationReason.trim()) {
      onEscalateCase(activeCase.id, escalationReason.trim());
      setShowEscalationModal(false);
      setEscalationReason('');
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
      {/* Case Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar
              fallback={`${activeCase.patient.firstName[0]}${activeCase.patient.lastName[0]}`}
              size="md"
              userType="patient"
            />
            <div>
              <div className="flex items-center space-x-2">
                <Heading2 className="text-gray-900">
                  {activeCase.patient.firstName} {activeCase.patient.lastName}
                </Heading2>
                <StatusIndicator status={activeCase.status} size="sm" />
              </div>
              <BodyText className="text-gray-600 mt-1">{activeCase.subject}</BodyText>
              <div className="flex items-center space-x-4 mt-2">
                <PriorityTag priority={activeCase.priority} size="sm" />
                <SmallText className="text-gray-500">
                  Created {formatTimeAgo(activeCase.createdAt)}
                </SmallText>
                <SmallText className="text-gray-500">
                  Updated {formatTimeAgo(activeCase.updatedAt)}
                </SmallText>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Primary Actions */}
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
          </div>
        </div>

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

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
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

        {/* Conversation Thread */}
        <div className="flex-1 overflow-auto">
          <ConversationThread
            messages={activeCase.messages}
            aiResponses={approvedAIResponses}
          />
        </div>

        {/* Pending AI Responses */}
        {pendingAIResponses.length > 0 && (
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="mb-3 flex items-center justify-between">
              <Heading3 className="text-gray-700">
                Pending AI Responses ({pendingAIResponses.length})
              </Heading3>
              {!batchMode && (
                <Badge variant="warning" size="sm">
                  Requires Review
                </Badge>
              )}
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {pendingAIResponses.map((response) => (
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
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  
                  <AIResponseDraft
                    aiResponse={response}
                    onApprove={(id, modifications) => onApproveAIResponse(activeCase.id, id, modifications)}
                    onReject={(id, reason) => onRejectAIResponse(activeCase.id, id, reason)}
                    onEdit={(id, content) => onEditAIResponse(activeCase.id, id, content)}
                    isLoading={isLoading}
                    className={batchMode ? 'ml-8' : ''}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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

      {/* Escalation Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <Heading3 className="text-gray-900 mb-4">
              Escalate Case
            </Heading3>
            <BodyText className="text-gray-600 mb-4">
              Escalate this case to a supervisor or specialist. Please provide a reason for escalation.
            </BodyText>
            <textarea
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder="Enter escalation reason..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowEscalationModal(false);
                  setEscalationReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleEscalateCase}
                disabled={!escalationReason.trim()}
              >
                Escalate Case
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveCasePanel;
