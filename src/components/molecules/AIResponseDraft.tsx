import React, { useState, useEffect, useCallback } from 'react';
import { Button, ConfidenceScore, Badge, SmallText, Caption, Text, Tooltip, Toggle, ResponseStateIndicator } from '../atoms';
import EditReasonSelector from './EditReasonSelector';
import type { AIResponse, ResponseState, EditReason, ResponseMode } from '../../types';

interface AIResponseDraftProps {
  aiResponse: AIResponse;
  onApprove: (id: string, modifications?: string[]) => void;
  onReject: (id: string, reason: string) => void;
  onEdit: (id: string, newContent: string, editReason: EditReason, customReason?: string) => void;
  isLoading?: boolean;
  className?: string;
}

const AIResponseDraft: React.FC<AIResponseDraftProps> = ({
  aiResponse,
  onApprove,
  onReject,
  onEdit,
  isLoading = false,
  className = ''
}) => {
  // Enhanced state management
  const [responseState, setResponseState] = useState<ResponseState>({
    mode: 'pending',
    isModified: false,
    originalContent: aiResponse.content,
    currentContent: aiResponse.content
  });

  const [showInternalNote, setShowInternalNote] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Update state when aiResponse changes
  useEffect(() => {
    setResponseState(prev => ({
      ...prev,
      originalContent: aiResponse.content,
      currentContent: prev.mode === 'editing' ? prev.currentContent : aiResponse.content
    }));
  }, [aiResponse.content]);

  // Enhanced state-based styling with animations
  const getStateStyles = (mode: ResponseMode) => {
    switch (mode) {
      case 'pending':
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300';
      case 'editing':
        return 'bg-blue-50 border-blue-300 state-glow animate-fade-in';
      case 'resolved':
        return 'bg-green-50 border-green-200 state-glow-success';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStateBadgeVariant = (mode: ResponseMode): 'default' | 'success' | 'warning' | 'error' | 'info' => {
    switch (mode) {
      case 'pending':
        return 'default';
      case 'editing':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  // Enhanced container styling with state animations
  const getContainerClasses = (mode: ResponseMode) => {
    const baseClasses = 'bg-white border rounded-lg p-4 state-transition';
    const stateClasses = getStateStyles(mode);
    
    return `${baseClasses} ${stateClasses}`;
  };

  // Event handlers
  const handleEditModeToggle = useCallback(() => {
    if (responseState.mode === 'editing') {
      // Cancel edit
      setResponseState(prev => ({
        ...prev,
        mode: 'pending',
        currentContent: prev.originalContent,
        editReason: undefined,
        customEditReason: undefined,
        isModified: false
      }));
    } else {
      // Enter edit mode
      setResponseState(prev => ({
        ...prev,
        mode: 'editing'
      }));
    }
  }, [responseState.mode]);

  const handleContentChange = useCallback((content: string) => {
    setResponseState(prev => ({
      ...prev,
      currentContent: content,
      isModified: content !== prev.originalContent
    }));
  }, []);

  const handleEditReasonChange = useCallback((reason: EditReason, customText?: string) => {
    setResponseState(prev => ({
      ...prev,
      editReason: reason,
      customEditReason: customText
    }));
  }, []);

  const validateEditForm = (): { isValid: boolean; error?: string } => {
    if (!responseState.editReason) {
      return { isValid: false, error: 'Please select a reason for this edit' };
    }
    
    if (responseState.editReason === 'other' && !responseState.customEditReason?.trim()) {
      return { isValid: false, error: 'Please provide a custom reason for this edit' };
    }
    
    if (!responseState.currentContent.trim()) {
      return { isValid: false, error: 'Response content cannot be empty' };
    }

    return { isValid: true };
  };

  const handleSaveEdit = useCallback(() => {
    const validation = validateEditForm();
    if (!validation.isValid) {
      return;
    }

    if (responseState.isModified && responseState.editReason) {
      onEdit(
        aiResponse.id, 
        responseState.currentContent.trim(), 
        responseState.editReason,
        responseState.customEditReason
      );
      
      setResponseState(prev => ({
        ...prev,
        mode: 'resolved',
        originalContent: prev.currentContent,
        isModified: false
      }));
    }
  }, [responseState, aiResponse.id, onEdit]);

  const handleApprove = useCallback(() => {
    const modifications = responseState.isModified ? [responseState.currentContent] : undefined;
    onApprove(aiResponse.id, modifications);
    
    setResponseState(prev => ({
      ...prev,
      mode: 'resolved'
    }));
  }, [responseState.isModified, responseState.currentContent, aiResponse.id, onApprove]);

  const handleReject = useCallback(() => {
    if (rejectReason.trim()) {
      onReject(aiResponse.id, rejectReason.trim());
      setShowRejectModal(false);
      setRejectReason('');
    }
  }, [rejectReason, aiResponse.id, onReject]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'e':
            event.preventDefault();
            if (responseState.mode !== 'resolved') {
              handleEditModeToggle();
            }
            break;
          case 'Enter':
            event.preventDefault();
            if (responseState.mode === 'editing') {
              handleSaveEdit();
            } else if (responseState.mode === 'pending') {
              handleApprove();
            }
            break;
        }
      } else if (event.key === 'Escape' && responseState.mode === 'editing') {
        event.preventDefault();
        handleEditModeToggle();
      }
    };

    if (responseState.mode !== 'resolved') {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [responseState.mode, handleEditModeToggle, handleSaveEdit, handleApprove]);

  const validation = validateEditForm();

  return (
    <div className={`${getContainerClasses(responseState.mode)} ${className}`}>
      {/* Enhanced Header with State Management */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <SmallText weight="medium" variant="muted">AI Draft Response</SmallText>
            <ResponseStateIndicator 
              state={responseState.mode} 
              size="sm" 
              showLabel={false}
              animated={true}
            />
          </div>
          
          <Badge 
            variant={getStateBadgeVariant(responseState.mode)} 
            className={`text-xs capitalize animate-fade-in ${responseState.mode === 'editing' ? 'animate-pulse-subtle' : ''}`}
          >
            {responseState.mode}
          </Badge>
          
          {responseState.isModified && (
            <Badge variant="warning" className="text-xs animate-slide-in">
              Modified
            </Badge>
          )}

          <Tooltip content={`${aiResponse.confidenceScore}% confidence - ${aiResponse.confidence} risk`}>
            <Badge variant="default" className="text-xs">
              {aiResponse.confidenceScore}%
            </Badge>
          </Tooltip>
        </div>

        <Caption variant="muted">
          {new Date(aiResponse.generatedAt).toLocaleTimeString()}
        </Caption>
      </div>

      {/* Enhanced Response Content with State Animations */}
      <div className="mb-4">
        {responseState.mode === 'editing' ? (
          <div className="space-y-4 animate-slide-in">
            <div className="relative">
              <textarea
                value={responseState.currentContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full p-3 border border-blue-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent state-transition state-glow"
                rows={6}
                placeholder="Edit the AI-generated response..."
                disabled={isLoading}
              />
              {responseState.isModified && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
            
            {/* Edit Reason Selector with Animation */}
            <div className="animate-fade-in">
              <EditReasonSelector
                value={responseState.editReason}
                customReason={responseState.customEditReason}
                onReasonChange={handleEditReasonChange}
                error={!validation.isValid ? validation.error : undefined}
              />
            </div>
            
            <div className="flex justify-end space-x-2 animate-slide-in">
              <Tooltip content="Cancel edit (Esc)">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleEditModeToggle}
                  disabled={isLoading}
                  className="state-transition"
                >
                  Cancel
                </Button>
              </Tooltip>
              <Tooltip content="Save changes (Ctrl+Enter)">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!validation.isValid || isLoading}
                  className={`state-transition ${validation.isValid ? 'animate-bounce-gentle' : ''}`}
                >
                  Save Changes
                </Button>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div 
            className={`p-3 rounded-lg border state-transition ${
              responseState.mode === 'resolved' 
                ? 'border-green-200 cursor-default bg-green-25' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 cursor-pointer hover:state-glow'
            }`}
            onClick={() => responseState.mode !== 'resolved' && !isLoading && handleEditModeToggle()}
          >
            <Text className="whitespace-pre-wrap leading-relaxed">
              {responseState.currentContent}
            </Text>
            {responseState.mode !== 'resolved' && !isLoading && (
              <Caption variant="primary" className="mt-2 opacity-60 animate-fade-in">
                Click to edit this response (Ctrl+E)
              </Caption>
            )}
            {responseState.mode === 'resolved' && (
              <div className="mt-2 flex items-center text-green-600 animate-fade-in">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <Caption>Response sent successfully</Caption>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Internal Notes Section */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Toggle
            pressed={showInternalNote}
            onPressedChange={setShowInternalNote}
            size="sm"
            disabled={responseState.mode === 'resolved'}
          />
          <SmallText variant="muted">Internal Notes</SmallText>
        </div>
        
        {showInternalNote && (
          <textarea
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Add internal notes for team reference (not sent to patient)..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            rows={3}
            disabled={responseState.mode === 'resolved'}
          />
        )}
      </div>

      {/* Enhanced Action Buttons with State Animations */}
      {responseState.mode !== 'editing' && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 animate-fade-in">
          <div className="flex space-x-2">
            {responseState.mode === 'pending' && (
              <>
                <Tooltip content="Approve & send (Ctrl+Enter)">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="state-transition hover:animate-bounce-gentle"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve & Send
                  </Button>
                </Tooltip>
                
                <Tooltip content="Edit response (Ctrl+E)">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleEditModeToggle}
                    disabled={isLoading}
                    className="state-transition"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                </Tooltip>
              </>
            )}

            {responseState.mode === 'resolved' && (
              <div className="flex items-center animate-slide-in">
                <Badge variant="success" className="flex items-center animate-bounce-gentle">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Response Sent
                </Badge>
                <ResponseStateIndicator 
                  state="resolved" 
                  size="sm" 
                  showLabel={false}
                  animated={true}
                  className="ml-2"
                />
              </div>
            )}
          </div>

          {responseState.mode === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRejectModal(true)}
              disabled={isLoading}
              className="state-transition hover:state-glow-warning"
            >
              Escalate
            </Button>
          )}
        </div>
      )}

      {/* Enhanced Escalation Modal with Animations */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 w-full max-w-md animate-slide-in state-glow-warning">
            <Text size="lg" weight="medium" className="mb-4">
              Escalate Case
            </Text>
            <SmallText variant="muted" className="mb-4">
              Escalate this case to a supervisor. Please provide a reason for escalation.
            </SmallText>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter escalation reason..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent state-transition"
              rows={4}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="state-transition"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className={`state-transition ${rejectReason.trim() ? 'state-glow-warning animate-bounce-gentle' : ''}`}
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

export default AIResponseDraft;
