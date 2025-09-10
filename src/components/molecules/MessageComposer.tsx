import React, { useState, useRef } from 'react';
import { Button, Tooltip } from '../atoms';
import type { AIResponse } from '../../types';

interface MessageComposerProps {
  onSend: (content: string, isDraft?: boolean) => void;
  onRequestAISuggestion?: () => void;
  aiSuggestion?: AIResponse | null;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  onRequestAISuggestion,
  aiSuggestion,
  isLoading = false,
  placeholder = "Type your response...",
  className = ''
}) => {
  const [content, setContent] = useState('');
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
      setShowAISuggestion(false);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleSaveDraft = () => {
    if (content.trim()) {
      onSend(content.trim(), true);
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send with Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleUseAISuggestion = () => {
    if (aiSuggestion) {
      setContent(aiSuggestion.content);
      setShowAISuggestion(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
      }
    }
  };

  const handleRequestAISuggestion = () => {
    if (onRequestAISuggestion) {
      onRequestAISuggestion();
      setShowAISuggestion(true);
    }
  };

  return (
    <div className={`bg-white border-t border-gray-200 ${className}`}>
      {/* AI Suggestion Panel */}
      {showAISuggestion && aiSuggestion && (
        <div className="p-4 bg-purple-50 border-b border-purple-200">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-purple-700">AI Suggestion</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  aiSuggestion.confidence === 'high' ? 'bg-green-500' :
                  aiSuggestion.confidence === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-gray-600">{aiSuggestion.confidenceScore}%</span>
              </div>
            </div>
            <button
              onClick={() => setShowAISuggestion(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{aiSuggestion.content}</p>
          </div>

          {aiSuggestion.clinicalReasoning && (
            <details className="mb-3">
              <summary className="text-sm text-purple-700 cursor-pointer hover:text-purple-800 font-medium">
                Clinical Reasoning
              </summary>
              <div className="mt-2 p-2 bg-white rounded text-xs text-gray-600">
                {aiSuggestion.clinicalReasoning}
              </div>
            </details>
          )}

          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleUseAISuggestion}
            >
              Use Suggestion
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAISuggestion(false)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Message Composer */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            disabled={isLoading}
          />
          
          {/* Character count */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {content.length}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            {/* AI Suggestion Button */}
            {onRequestAISuggestion && (
              <Tooltip content="Get AI suggestion for this response">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRequestAISuggestion}
                  disabled={isLoading}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  AI Suggest
                </Button>
              </Tooltip>
            )}

            {/* Template/Snippets Button */}
            <Tooltip content="Insert common response templates">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isLoading}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Templates
              </Button>
            </Tooltip>

            {/* Formatting hint */}
            <span className="text-xs text-gray-400">
              Ctrl+Enter to send
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Save Draft */}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isLoading || !content.trim()}
            >
              Save Draft
            </Button>

            {/* Send Button */}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isLoading || !content.trim()}
              className="min-w-[80px]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageComposer;
