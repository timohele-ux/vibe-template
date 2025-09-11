import React, { useState } from 'react';
import { Button, ConfidenceScore, Badge, SmallText, Caption, Text } from '../atoms';
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
  const [showReasoning, setShowReasoning] = useState(false);
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

  const getRiskLevelColor = (level: string): string => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <SmallText weight="medium" variant="primary">AI Response Draft</SmallText>
          </div>
          
          <ConfidenceScore 
            score={aiResponse.confidenceScore} 
            level={aiResponse.confidence}
            size="sm"
          />

          {aiResponse.riskAssessment.level !== 'low' && (
            <Badge 
              variant={aiResponse.riskAssessment.level === 'high' ? 'error' : 'warning'}
              className="border"
            >
              {aiResponse.riskAssessment.level.toUpperCase()} RISK
            </Badge>
          )}
        </div>

        <Caption variant="muted">
          Generated {new Date(aiResponse.generatedAt).toLocaleTimeString()}
        </Caption>
      </div>

      {/* Content */}
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={6}
              placeholder="Edit the AI-generated response..."
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editedContent.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="bg-white p-3 rounded-lg border border-purple-100 cursor-pointer hover:border-purple-200 transition-colors"
            onClick={() => !isLoading && setIsEditing(true)}
          >
            <SmallText className="whitespace-pre-wrap leading-relaxed">
              {editedContent}
            </SmallText>
            {!isLoading && (
              <Caption variant="primary" className="mt-2 opacity-60">
                Click to edit
              </Caption>
            )}
          </div>
        )}
      </div>

      {/* Clinical Reasoning */}
      {aiResponse.clinicalReasoning && (
        <div className="mb-4">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="flex items-center space-x-2 hover:text-purple-800 transition-colors"
          >
            <svg 
              className={`w-4 h-4 transform transition-transform ${showReasoning ? 'rotate-90' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <SmallText weight="medium" variant="primary">Clinical Reasoning</SmallText>
          </button>
          
          {showReasoning && (
            <div className="mt-2 p-3 bg-white rounded-lg border border-purple-100">
              <SmallText className="leading-relaxed">
                {aiResponse.clinicalReasoning}
              </SmallText>
            </div>
          )}
        </div>
      )}

      {/* Risk Assessment */}
      {aiResponse.riskAssessment.factors.length > 0 && (
        <div className="mb-4">
          <SmallText weight="medium" className="mb-2">Risk Factors:</SmallText>
          <div className="space-y-1">
            {aiResponse.riskAssessment.factors.map((factor, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  aiResponse.riskAssessment.level === 'high' ? 'bg-red-400' :
                  aiResponse.riskAssessment.level === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                }`}></div>
                <Caption>{factor}</Caption>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Actions */}
      {aiResponse.suggestedActions.length > 0 && (
        <div className="mb-4">
          <SmallText weight="medium" className="mb-2">Suggested Actions:</SmallText>
          <div className="space-y-1">
            {aiResponse.suggestedActions.map((action, index) => (
              <div key={index} className="flex items-start space-x-2">
                <svg className="w-3 h-3 mt-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Caption>{action}</Caption>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex items-center justify-between pt-3 border-t border-purple-200">
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
              Approve & Send
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowRejectModal(true)}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject
          </Button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <Text size="lg" weight="medium" className="mb-4">
              Reject AI Response
            </Text>
            <SmallText variant="muted" className="mb-4">
              Please provide a reason for rejecting this AI-generated response. This helps improve future suggestions.
            </SmallText>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                variant="danger"
                size="sm"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                Reject Response
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResponseDraft;
