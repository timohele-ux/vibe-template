import React from 'react';

type CaseStatus = 'new' | 'in-progress' | 'awaiting-approval' | 'resolved' | 'escalated';

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: CaseStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ 
    className = '',
    status,
    size = 'md',
    showLabel = true,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center gap-2';
    
    const statusClasses = {
      new: 'text-blue-700',
      'in-progress': 'text-yellow-700',
      'awaiting-approval': 'text-purple-700',
      resolved: 'text-green-700',
      escalated: 'text-red-700',
    };
    
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const getStatusDot = (statusType: CaseStatus): string => {
      switch (statusType) {
        case 'new':
          return '🔵';
        case 'in-progress':
          return '🟡';
        case 'awaiting-approval':
          return '🟣';
        case 'resolved':
          return '🟢';
        case 'escalated':
          return '🔴';
      }
    };

    const getStatusLabel = (statusType: CaseStatus): string => {
      switch (statusType) {
        case 'new':
          return 'New';
        case 'in-progress':
          return 'In Progress';
        case 'awaiting-approval':
          return 'Awaiting Approval';
        case 'resolved':
          return 'Resolved';
        case 'escalated':
          return 'Escalated';
      }
    };

    return (
      <div
        className={`${baseClasses} ${statusClasses[status]} ${sizeClasses[size]} ${className}`}
        ref={ref}
        {...props}
      >
        <span>{getStatusDot(status)}</span>
        {showLabel && (
          <span className="font-medium">
            {getStatusLabel(status)}
          </span>
        )}
      </div>
    );
  }
);

StatusIndicator.displayName = 'StatusIndicator';

export default StatusIndicator;
