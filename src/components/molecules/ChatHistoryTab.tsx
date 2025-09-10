import React, { useState } from 'react';
import { Badge, Button, Avatar } from '../atoms';
import type { Case } from '../../types';

interface ChatHistoryTabProps {
  patientId: string;
  previousCases?: Case[];
  className?: string;
}

const ChatHistoryTab: React.FC<ChatHistoryTabProps> = ({
  patientId,
  previousCases = [],
  className = ''
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '1y' | 'all'>('90d');
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const filterCasesByPeriod = (cases: Case[], period: string): Case[] => {
    const now = new Date();
    let filterDate: Date;

    switch (period) {
      case '30d':
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        filterDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        filterDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return cases;
    }

    return cases.filter(c => new Date(c.createdAt) >= filterDate);
  };

  const getConversationMetrics = (cases: Case[]) => {
    const totalMessages = cases.reduce((sum, c) => sum + c.messages.length, 0);
    const avgResponseTime = cases.length > 0 
      ? cases.reduce((sum, c) => sum + (c.actualResponseTime || 0), 0) / cases.length 
      : 0;
    const satisfactionScores = cases.filter(c => c.satisfactionScore).map(c => c.satisfactionScore!);
    const avgSatisfaction = satisfactionScores.length > 0
      ? satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length
      : 0;

    return {
      totalCases: cases.length,
      totalMessages,
      avgResponseTime: Math.round(avgResponseTime),
      avgSatisfaction: Math.round(avgSatisfaction * 10) / 10
    };
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getSentimentColor = (sentiment?: string): string => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      default:
        return '😐';
    }
  };

  const filteredCases = filterCasesByPeriod(previousCases, selectedPeriod);
  const metrics = getConversationMetrics(filteredCases);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Chat History</h3>
        
        {/* Time Period Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['30d', '90d', '1y', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selectedPeriod === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period === '30d' ? '30 Days' : 
               period === '90d' ? '90 Days' :
               period === '1y' ? '1 Year' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-900">{metrics.totalCases}</div>
          <div className="text-xs text-blue-700">Total Conversations</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-900">{metrics.totalMessages}</div>
          <div className="text-xs text-green-700">Total Messages</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-purple-900">{metrics.avgResponseTime}m</div>
          <div className="text-xs text-purple-700">Avg Response Time</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-yellow-900">
            {metrics.avgSatisfaction > 0 ? metrics.avgSatisfaction : '—'}
          </div>
          <div className="text-xs text-yellow-700">Satisfaction Score</div>
        </div>
      </div>

      {/* Conversation History */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Recent Conversations ({filteredCases.length})
        </div>

        {filteredCases.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredCases.map((case_) => (
              <div key={case_.id} className="border border-gray-200 rounded-lg p-3">
                <div 
                  className="cursor-pointer"
                  onClick={() => setExpandedCase(expandedCase === case_.id ? null : case_.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {case_.subject}
                        </h4>
                        <Badge
                          variant={case_.priority === 'critical' ? 'error' : 
                                 case_.priority === 'urgent' ? 'warning' : 'default'}
                          size="sm"
                        >
                          {case_.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimeAgo(case_.createdAt)} • {case_.messages.length} messages
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {case_.satisfactionScore && (
                        <div className="text-xs text-gray-500">
                          ⭐ {case_.satisfactionScore}
                        </div>
                      )}
                      <svg 
                        className={`w-4 h-4 text-gray-400 transform transition-transform ${
                          expandedCase === case_.id ? 'rotate-90' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Case Summary */}
                  <div className="text-xs text-gray-600 mb-2">
                    {case_.summary}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {case_.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="default" size="sm" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {case_.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{case_.tags.length - 3} more</span>
                      )}
                    </div>
                    
                    <Badge
                      variant={case_.status === 'resolved' ? 'success' : 
                             case_.status === 'escalated' ? 'warning' : 'info'}
                      size="sm"
                    >
                      {case_.status}
                    </Badge>
                  </div>
                </div>

                {/* Expanded Case Details */}
                {expandedCase === case_.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Message Preview
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {case_.messages.slice(-3).map((message, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Avatar
                            fallback={message.senderType === 'patient' ? 'P' : 'S'}
                            size="xs"
                            userType={message.senderType as any}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-xs font-medium text-gray-700">
                                {message.senderName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(message.timestamp)}
                              </span>
                              {message.sentiment && (
                                <span className="text-xs">
                                  {getSentimentIcon(message.sentiment)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="xs"
                        className="text-xs"
                      >
                        View Full Conversation
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">No conversation history</h4>
            <p className="text-xs text-gray-500">
              No previous conversations found for the selected time period
            </p>
          </div>
        )}
      </div>

      {/* Communication Patterns */}
      {filteredCases.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Communication Patterns
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-green-600 font-medium">
                {Math.round((filteredCases.filter(c => c.messages.some(m => m.sentiment === 'positive')).length / filteredCases.length) * 100)}%
              </div>
              <div className="text-gray-500">Positive</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 font-medium">
                {Math.round((filteredCases.filter(c => c.messages.some(m => m.sentiment === 'neutral')).length / filteredCases.length) * 100)}%
              </div>
              <div className="text-gray-500">Neutral</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-medium">
                {Math.round((filteredCases.filter(c => c.messages.some(m => m.sentiment === 'negative')).length / filteredCases.length) * 100)}%
              </div>
              <div className="text-gray-500">Negative</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistoryTab;
