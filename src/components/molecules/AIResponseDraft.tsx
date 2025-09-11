import React, { useState } from 'react';
import { Button, ConfidenceScore, Badge, SmallText, Caption, Text, Tooltip, Toggle } from '../atoms';
import type { AIResponse } from '../../types';

interface AIResponseDraftProps {
  aiResponse: AIResponse;
  onApprove: (id: string, modifications?: string[]) => void;
  onReject: (id: string, reason: string) => void;
  onEdit: (id: string, newContent: string) => void;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(aiResponse.content);
  const [showInternalNote, setShowInternalNote] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleSaveEdit = () => {
    if (editedContent.trim() !== aiResponse.content) {
      onEdit(aiResponse.id, editedContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(aiResponse.content);
    setIsEditing(false);
  };

  const handleApprove = () => {
    const modifications = editedContent !== aiResponse.content ? [editedContent] : undefined;
    onApprove(aiResponse.id, modifications);
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(aiResponse.id, rejectReason.trim());
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Simplified Header with Confidence Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <SmallText weight="medium" variant="muted">AI Draft Response</SmallText>
          
          <Tooltip content={`${aiResponse.confidenceScore}% confidence - ${aiResponse.confidence} risk`}>
            <Badge 
              variant="default"
              className="text-xs"
            >
              {aiResponse.confidenceScore}%
            </Badge>
          </Tooltip>
        </div>

        <Caption variant="muted">
          {new Date(aiResponse.generatedAt).toLocaleTimeString()}
        </Caption>
      </div>

      {/* Single Editable Draft Response */}
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              rows={6}
              placeholder="Edit the AI-generated response..."
              disabled={isLoading}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editedContent.trim() || isLoading}
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary-300 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => !isLoading && setIsEditing(true)}
          >
            <Text className="whitespace-pre-wrap leading-relaxed">
              {editedContent}
            </Text>
            {!isLoading && (
              <Caption variant="primary" className="mt-2 opacity-60">
                Click to edit this response
              </Caption>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Internal Notes Section */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Toggle
            pressed={showInternalNote}
            onPressedChange={setShowInternalNote}
            size="sm"
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
          />
        )}
      </div>

      {/* Streamlined Action Buttons */}
      {!isEditing && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleApprove}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Request Edit
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRejectModal(true)}
            disabled={isLoading}
          >
            Escalate
          </Button>
        </div>
      )}

      {/* Simplified Rejection/Escalation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <Text size="lg" weight="medium" className="mb-4">
              Escalate Case
            </Text>
            <SmallText variant="muted" className="mb-4">
              Escalate this case to a supervisor. Please provide a reason.
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
