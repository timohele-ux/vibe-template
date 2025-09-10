import React from 'react';

type ConfidenceLevel = 'high' | 'medium' | 'low';

interface ConfidenceScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number; // 0-100
  level: ConfidenceLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showProgressBar?: boolean;
}

const ConfidenceScore = React.forwardRef<HTMLDivElement, ConfidenceScoreProps>(
  ({ 
    className = '',
    level = 'medium', 
    size = 'md', 
    score, 
    showLabel = true, 
    showProgressBar = false,
    ...props 
  }, ref) => {
    const getConfidenceIcon = (confidenceLevel: ConfidenceLevel): string => {
      switch (confidenceLevel) {
        case 'high':
          return '●';
        case 'medium':
          return '◐';
        case 'low':
          return '○';
      }
    };

    const getConfidenceLabel = (confidenceLevel: ConfidenceLevel): string => {
      switch (confidenceLevel) {
        case 'high':
          return 'High Confidence';
        case 'medium':
          return 'Medium Confidence';
        case 'low':
          return 'Low Confidence';
      }
    };

    const baseClasses = 'inline-flex items-center gap-1 font-medium transition-colors border rounded-md';
    
    const levelClasses = {
      high: 'text-green-700 bg-green-50 border-green-200',
      medium: 'text-amber-700 bg-amber-50 border-amber-200',
      low: 'text-red-700 bg-red-50 border-red-200',
    };
    
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    };

    const progressBarClasses = {
      high: 'bg-green-500',
      medium: 'bg-amber-500',
      low: 'bg-red-500',
    };

    return (
      <div
        className={`${baseClasses} ${levelClasses[level]} ${sizeClasses[size]} ${className}`}
        ref={ref}
        {...props}
      >
        <span className="text-current">
          {getConfidenceIcon(level)}
        </span>
        <span className="font-semibold">
          {score}%
        </span>
        {showLabel && (
          <span className="ml-1">
            {getConfidenceLabel(level)}
          </span>
        )}
        {showProgressBar && (
          <div className="ml-2 w-12 bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${progressBarClasses[level]}`}
              style={{ width: `${score}%` }}
            />
          </div>
        )}
      </div>
    );
  }
);

ConfidenceScore.displayName = 'ConfidenceScore';

export default ConfidenceScore;
