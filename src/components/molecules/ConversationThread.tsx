import React from 'react';
import { Avatar, ConfidenceScore, BodyText, SmallText, Caption } from '../atoms';
import type { Message, AIResponse } from '../../types';

interface ConversationThreadProps {
  messages: Message[];
  aiResponses?: AIResponse[];
  className?: string;
}

const ConversationThread: React.FC<ConversationThreadProps> = ({
  messages,
  aiResponses = [],
  className = ''
}) => {
  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSenderTypeColor = (senderType: string): string => {
    switch (senderType) {
      case 'patient':
        return 'bg-blue-500';
      case 'staff':
        return 'bg-green-500';
      case 'ai':
        return 'bg-purple-500';
      case 'system':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      case 'neutral':
      default:
        return null;
    }
  };

  // Combine messages and AI responses, then sort by timestamp
  const allItems = [
    ...messages.map(msg => ({ ...msg, type: 'message' as const })),
    ...aiResponses.map(response => ({ 
      ...response, 
      type: 'aiResponse' as const,
      timestamp: response.generatedAt,
      senderType: 'ai' as const,
      senderName: 'AI Assistant',
      isRead: true
    }))
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className={`flex flex-col space-y-4 p-4 ${className}`}>
      {allItems.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <BodyText variant="muted">No conversation history yet</BodyText>
        </div>
      ) : (
        allItems.map((item, index) => {
          const showDateSeparator = index === 0 || 
            formatDate(new Date(item.timestamp)) !== formatDate(new Date(allItems[index - 1].timestamp));

          return (
            <div key={`${item.type}-${item.id}`}>
              {/* Date Separator */}
              {showDateSeparator && (
                <div className="flex items-center justify-center py-2">
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <Caption variant="muted" weight="medium">
                      {formatDate(new Date(item.timestamp))}
                    </Caption>
                  </div>
                </div>
              )}

              {/* Message/AI Response */}
              <div className={`flex ${item.senderType === 'patient' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs lg:max-w-md flex ${item.senderType === 'patient' ? 'flex-row' : 'flex-row-reverse'} space-x-3`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar
                      fallback={item.senderName.split(' ').map(n => n[0]).join('')}
                      size="sm"
                      userType={item.senderType === 'patient' ? 'patient' : item.senderType === 'ai' ? 'ai' : 'staff'}
                    />
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col ${item.senderType === 'patient' ? 'items-start' : 'items-end'}`}>
                    {/* Sender Info */}
                    <div className={`flex items-center space-x-2 mb-1 ${item.senderType === 'patient' ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                      <Caption weight="medium">
                        {item.senderName}
                      </Caption>
                      <Caption variant="muted">
                        {formatTime(new Date(item.timestamp))}
                      </Caption>
                      {item.type === 'message' && getSentimentIcon(item.sentiment) && (
                        <Caption>{getSentimentIcon(item.sentiment)}</Caption>
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`
                        px-4 py-2 rounded-lg max-w-full break-words
                        ${item.senderType === 'patient' 
                          ? 'bg-blue-100 text-blue-900' 
                          : item.senderType === 'ai'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : 'bg-green-100 text-green-900'
                        }
                        ${item.type === 'message' && !item.isRead ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                      `}
                    >
                      <SmallText className="whitespace-pre-wrap">{item.content}</SmallText>

                      {/* AI Response Confidence Score */}
                      {item.type === 'aiResponse' && (
                        <div className="mt-2 pt-2 border-t border-purple-200">
                          <ConfidenceScore 
                            score={item.confidenceScore} 
                            level={item.confidence}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                      )}
                    </div>

                    {/* Message Status */}
                    <div className="flex items-center mt-1 space-x-1">
                      {item.type === 'message' && (
                        <>
                          {item.isRead ? (
                            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                          )}
                        </>
                      )}

                      {item.type === 'aiResponse' && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          <Caption variant="primary">AI Generated</Caption>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ConversationThread;
