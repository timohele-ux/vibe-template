import React, { useState } from 'react';
import { Button, Checkbox, Badge } from '../atoms';

interface BatchAction {
  id: string;
  label: string;
  description: string;
  type: 'approve' | 'reject' | 'escalate';
  icon: React.ReactNode;
}

interface BatchActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchAction: (action: string, reason?: string) => void;
  isProcessing?: boolean;
  className?: string;
}

const BatchActions: React.FC<BatchActionsProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBatchAction,
  isProcessing = false,
  className = ''
}) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const batchActions: BatchAction[] = [
    {
      id: 'approve-all',
      label: 'Approve All',
      description: 'Approve and send all selected AI responses',
      type: 'approve',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      id: 'reject-all',
      label: 'Reject All',
      description: 'Reject all selected AI responses',
      type: 'reject',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    {
      id: 'escalate-all',
      label: 'Escalate All',
      description: 'Escalate all selected cases to a supervisor',
      type: 'escalate',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      )
    }
  ];

  const handleBatchAction = (actionId: string, actionType: string) => {
    if (actionType === 'reject') {
      setShowRejectReason(true);
    } else {
      onBatchAction(actionId);
    }
  };

  const handleRejectWithReason = () => {
    if (rejectReason.trim()) {
      onBatchAction('reject-all', rejectReason.trim());
      setShowRejectReason(false);
      setRejectReason('');
    }
  };

  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={allSelected ? onDeselectAll : onSelectAll}
              disabled={totalCount === 0 || isProcessing}
              className={someSelected ? 'data-[state=checked]:bg-blue-500' : ''}
            />
            <span className="text-sm font-medium text-gray-700">
              Select All ({totalCount})
            </span>
          </div>
          
          {selectedCount > 0 && (
            <Badge variant="info" size="sm">
              {selectedCount} selected
            </Badge>
          )}
        </div>

        {selectedCount > 0 && (
          <div className="text-xs text-gray-500">
            Batch operations will affect {selectedCount} item{selectedCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Batch Actions */}
      {selectedCount > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Batch Actions
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {batchActions.map((action) => (
              <Button
                key={action.id}
                variant={action.type}
                size="sm"
                onClick={() => handleBatchAction(action.id, action.type)}
                disabled={isProcessing}
                className="justify-start text-left"
                fullWidth
              >
                {action.icon}
                <div className="ml-2">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs opacity-75">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing batch actions...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No selection state */}
      {selectedCount === 0 && totalCount > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          Select one or more AI responses to enable batch actions
        </div>
      )}

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          No AI responses available for batch processing
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectReason && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Batch Reject Reason
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide a reason for rejecting {selectedCount} AI response{selectedCount !== 1 ? 's' : ''}. 
              This feedback helps improve future AI suggestions.
            </p>
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
                  setShowRejectReason(false);
                  setRejectReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="reject"
                size="sm"
                onClick={handleRejectWithReason}
                disabled={!rejectReason.trim()}
              >
                Reject {selectedCount} Response{selectedCount !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchActions;
