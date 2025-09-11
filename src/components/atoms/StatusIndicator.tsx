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
    const baseClasses = 'inline-flex items-center gap-2 transition-colors duration-200';
    
    const statusClasses = {
      new: 'text-primary-800',
      'in-progress': 'text-yellow-800',
      'awaiting-approval': 'text-purple-800',
      resolved: 'text-green-800',
      escalated: 'text-red-800',
    };
    
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const getStatusDot = (statusType: CaseStatus): string => {
      const dotClasses = {
        new: 'w-2 h-2 bg-primary-500 rounded-full',
        'in-progress': 'w-2 h-2 bg-yellow-500 rounded-full',
        'awaiting-approval': 'w-2 h-2 bg-purple-500 rounded-full',
        resolved: 'w-2 h-2 bg-green-500 rounded-full',
        escalated: 'w-2 h-2 bg-red-500 rounded-full',
      };
      return dotClasses[statusType];
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
        <div className={getStatusDot(status)} />
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
