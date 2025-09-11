import React, { useState, useEffect, useCallback } from 'react';
import { Button, ConfidenceScore, Badge, SmallText, Caption, Text, Tooltip, Toggle } from '../atoms';
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

  // State-based styling
  const getStateStyles = (mode: ResponseMode) => {
    switch (mode) {
      case 'pending':
        return 'bg-gray-50 border-gray-200';
      case 'editing':
        return 'bg-blue-50 border-blue-300';
      case 'resolved':
        return 'bg-green-50 border-green-200';
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
    <div className={`bg-white border rounded-lg p-4 transition-colors duration-200 ${getStateStyles(responseState.mode)} ${className}`}>
      {/* Enhanced Header with State Management */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <SmallText weight="medium" variant="muted">AI Draft Response</SmallText>
          
          <Badge variant={getStateBadgeVariant(responseState.mode)} className="text-xs capitalize">
            {responseState.mode}
          </Badge>
          
          {responseState.isModified && (
            <Badge variant="warning" className="text-xs">
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

      {/* Enhanced Response Content */}
      <div className="mb-4">
        {responseState.mode === 'editing' ? (
          <div className="space-y-4">
            <textarea
              value={responseState.currentContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              rows={6}
              placeholder="Edit the AI-generated response..."
              disabled={isLoading}
            />
            
            {/* Edit Reason Selector */}
            <EditReasonSelector
              value={responseState.editReason}
              customReason={responseState.customEditReason}
              onReasonChange={handleEditReasonChange}
              error={!validation.isValid ? validation.error : undefined}
            />
            
            <div className="flex justify-end space-x-2">
              <Tooltip content="Cancel edit (Esc)">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleEditModeToggle}
                  disabled={isLoading}
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
                >
                  Save Changes
                </Button>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div 
            className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
              responseState.mode === 'resolved' 
                ? 'border-green-200 cursor-default' 
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-100'
            }`}
            onClick={() => responseState.mode !== 'resolved' && !isLoading && handleEditModeToggle()}
          >
            <Text className="whitespace-pre-wrap leading-relaxed">
              {responseState.currentContent}
            </Text>
            {responseState.mode !== 'resolved' && !isLoading && (
              <Caption variant="primary" className="mt-2 opacity-60">
                Click to edit this response (Ctrl+E)
              </Caption>
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

      {/* Enhanced Action Buttons with Keyboard Shortcuts */}
      {responseState.mode !== 'editing' && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex space-x-2">
            {responseState.mode === 'pending' && (
              <>
                <Tooltip content="Approve & send (Ctrl+Enter)">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApprove}
                    disabled={isLoading}
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
              <Badge variant="success" className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Response Sent
              </Badge>
            )}
          </div>

          {responseState.mode === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRejectModal(true)}
              disabled={isLoading}
            >
              Escalate
            </Button>
          )}
        </div>
      )}

      {/* Enhanced Escalation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
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
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
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
