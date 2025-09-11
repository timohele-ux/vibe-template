import React from 'react';
import { Badge, Heading3, BodyText, SmallText, Caption } from '../atoms';
import type { DashboardMetrics } from '../../types';

interface QueueStatsProps {
  metrics: DashboardMetrics;
  className?: string;
}

const QueueStats: React.FC<QueueStatsProps> = ({
  metrics,
  className = ''
}) => {
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getResponseTimeColor = (minutes: number): string => {
    if (minutes <= 15) return 'text-green-600';
    if (minutes <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = [
    {
      label: 'Pending Cases',
      value: metrics.pendingCases,
      icon: (
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      urgent: metrics.pendingCases > 20
    },
    {
      label: 'Avg Response',
      value: formatTime(metrics.averageResponseTime),
      icon: (
        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: `bg-yellow-50 border-yellow-200 ${getResponseTimeColor(metrics.averageResponseTime)}`,
      urgent: metrics.averageResponseTime > 30
    },
    {
      label: 'Active Staff',
      value: metrics.activeStaffCount,
      icon: (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-green-50 text-green-700 border-green-200',
      urgent: metrics.activeStaffCount < 3
    },
    {
      label: 'Resolved Today',
      value: metrics.casesResolvedToday,
      icon: (
        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      urgent: false
    }
  ];

  return (
    <div className={`p-3 bg-gray-50 border-b border-gray-200 ${className}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`
              relative p-2 rounded-lg border transition-colors
              ${stat.color}
              ${stat.urgent ? 'ring-2 ring-red-200' : ''}
            `}
          >
            <div className="flex items-center space-x-2">
              {stat.icon}
              <div>
                <div className="flex items-center space-x-1">
                  <Heading3 className="text-current">
                    {stat.value}
                  </Heading3>
                  {stat.urgent && (
                    <Caption variant="danger">!</Caption>
                  )}
                </div>
                <Caption className="opacity-75">{stat.label}</Caption>
              </div>
            </div>

            {/* Urgent indicator */}
            {stat.urgent && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Caption variant="muted">AI Approval Rate:</Caption>
            <Caption variant="success" weight="medium">{Math.round(metrics.aiApprovalRate)}%</Caption>
          </div>
          <div className="flex items-center space-x-1">
            <Caption variant="muted">Escalation Rate:</Caption>
            <Caption variant="danger" weight="medium">{Math.round(metrics.escalationRate)}%</Caption>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Caption variant="muted">Live updates</Caption>
        </div>
      </div>
    </div>
  );
};

export default QueueStats;
