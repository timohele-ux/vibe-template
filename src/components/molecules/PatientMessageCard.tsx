import React from 'react';
import { Avatar, Heading3, Text, Caption } from '../atoms';
import Card from './Card';
import type { Message, Patient } from '../../types';

interface PatientMessageCardProps {
  message: Message;
  patient: Patient;
  className?: string;
}

const PatientMessageCard: React.FC<PatientMessageCardProps> = ({
  message,
  patient,
  className = ''
}) => {
  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getPatientInitials = (): string => {
    return `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
  };

  return (
    <Card className={`border-l-4 border-l-blue-400 ${className}`} padding="md">
      {/* Header with Patient Info */}
      <div className="flex items-center space-x-3 mb-3">
        <Avatar
          fallback={getPatientInitials()}
          size="sm"
          userType="patient"
          className="flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Heading3 className="text-gray-900">
              Patient Message
            </Heading3>
            <Caption variant="muted">
              {formatTime(message.timestamp)}
            </Caption>
          </div>
          <Caption variant="muted">
            From: {patient.firstName} {patient.lastName}
          </Caption>
        </div>
      </div>

      {/* Message Content */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <Text className="whitespace-pre-wrap leading-relaxed text-gray-800">
          {message.content}
        </Text>
      </div>

      {/* Message Metadata */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {message.sentiment && (
            <Caption variant="muted">
              Sentiment: {message.sentiment}
            </Caption>
          )}
          {message.attachments && message.attachments.length > 0 && (
            <Caption variant="muted">
              📎 {message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}
            </Caption>
          )}
        </div>
        <Caption variant="muted">
          Message ID: {message.id}
        </Caption>
      </div>
    </Card>
  );
};

export default PatientMessageCard;
