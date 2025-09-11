import React from 'react';
import { Avatar, Badge, PriorityTag, StatusIndicator, Heading4, BodyText, SmallText, Caption } from '../atoms';
import { Card } from '../molecules';
import type { Case } from '../../types';

interface CaseListItemProps {
  case: Case;
  isSelected?: boolean;
  isUnread?: boolean;
  onClick?: (caseId: string) => void;
}

const CaseListItem: React.FC<CaseListItemProps> = ({
  case: caseData,
  isSelected = false,
  isUnread = false,
  onClick
}) => {
  const handleClick = () => {
    onClick?.(caseData.id);
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getLastMessage = () => {
    if (caseData.messages.length === 0) return 'No messages';
    return caseData.messages[caseData.messages.length - 1].content;
  };

  const getUnreadCount = (): number => {
    return caseData.messages.filter(message => !message.isRead).length;
  };

  return (
    <div
      className={`
        p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50
        ${isSelected ? 'bg-primary-50 border-primary-200' : ''}
        ${isUnread ? 'border-l-4 border-l-primary-500' : 'border-l-4 border-l-transparent'}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Patient Avatar */}
        <Avatar
          src={caseData.patient.firstName ? undefined : undefined}
          fallback={`${caseData.patient.firstName[0]}${caseData.patient.lastName[0]}`}
          size="sm"
          userType="patient"
        />

        {/* Case Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 min-w-0">
              <Heading4 className={`text-gray-900 truncate ${isUnread ? 'font-semibold' : ''}`}>
                {caseData.patient.firstName} {caseData.patient.lastName}
              </Heading4>
              {getUnreadCount() > 0 && (
                <Badge variant="info" size="sm">
                  {getUnreadCount()}
                </Badge>
              )}
            </div>
            <Caption className="text-gray-500 whitespace-nowrap ml-2">
              {getTimeAgo(caseData.updatedAt)}
            </Caption>
          </div>

          {/* Subject */}
          <BodyText className={`text-gray-700 mb-2 truncate ${isUnread ? 'font-medium' : ''}`}>
            {caseData.subject}
          </BodyText>

          {/* Tags Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PriorityTag priority={caseData.priority} size="sm" />
              <StatusIndicator 
                status={caseData.status} 
                size="sm" 
                showLabel={false}
              />
            </div>

            {/* Response Time Indicator */}
            {caseData.estimatedResponseTime && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Caption className="text-gray-400">{caseData.estimatedResponseTime}m</Caption>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseListItem;
