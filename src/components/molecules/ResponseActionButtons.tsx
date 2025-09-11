import React from 'react';
import { Button, Tooltip, Badge } from '../atoms';
import type { ResponseMode, UserRole } from '../../types';

export interface ActionConfig {
  standard: ('approve-send' | 'save-draft' | 'forward-supervisor')[];
  clinical: ('escalate-clinical' | 'request-review')[];
  keyboard: {
    approve: string;
    edit: string;
    escape: string;
    help: string;
  };
}

export interface ResponseActionButtonsProps {
  responseMode: ResponseMode;
  userRole: UserRole;
  isLoading?: boolean;
  canApprove?: boolean;
  canEscalate?: boolean;
  isClinicalCase?: boolean;
  hasValidation?: boolean;
  onApprove: () => void;
  onSaveDraft: () => void;
  onEdit: () => void;
  onEscalate: () => void;
  onForwardSupervisor: () => void;
  onRequestReview: () => void;
  onShowShortcuts?: () => void;
  className?: string;
}

const defaultActionConfig: ActionConfig = {
  standard: ['approve-send', 'save-draft', 'forward-supervisor'],
  clinical: ['escalate-clinical', 'request-review'],
  keyboard: {
    approve: 'Ctrl+Enter',
    edit: 'Ctrl+E',
    escape: 'Escape',
    help: 'Ctrl+/'
  }
};

const ResponseActionButtons: React.FC<ResponseActionButtonsProps> = ({
  responseMode,
  userRole,
  isLoading = false,
  canApprove = true,
  canEscalate = true,
  isClinicalCase = false,
  hasValidation = true,
  onApprove,
  onSaveDraft,
  onEdit,
  onEscalate,
  onForwardSupervisor,
  onRequestReview,
  onShowShortcuts,
  className = ''
}) => {
  // Determine available actions based on user role and case type
  const getAvailableActions = () => {
    const actions = {
      showApprove: canApprove && responseMode === 'pending' && (userRole === 'admin' || userRole === 'clinician'),
      showSaveDraft: responseMode === 'editing',
      showEdit: responseMode === 'pending',
      showForward: responseMode === 'pending' && (userRole === 'support' || !canApprove),
      showEscalate: canEscalate && responseMode === 'pending',
      showClinicalReview: isClinicalCase && responseMode === 'pending' && userRole !== 'clinician',
      showResolved: responseMode === 'resolved'
    };

    return actions;
  };

  const actions = getAvailableActions();

  // Get button variant based on action type and state
  const getButtonVariant = (actionType: string): 'primary' | 'secondary' | 'outline' | 'ghost' => {
    switch (actionType) {
      case 'approve':
        return 'primary';
      case 'save':
        return 'primary';
      case 'edit':
        return 'secondary';
      case 'forward':
        return 'outline';
      case 'escalate':
        return 'outline';
      case 'review':
        return 'outline';
      default:
        return 'ghost';
    }
  };

  // Get action button icon
  const getActionIcon = (actionType: string) => {
    const iconClasses = 'w-4 h-4';
    
    switch (actionType) {
      case 'approve':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case 'save':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        );
      case 'edit':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'forward':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'escalate':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'review':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'help':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (actions.showResolved) {
    return (
      <div className={`flex items-center justify-between pt-3 border-t border-gray-200 animate-fade-in ${className}`}>
        <div className="flex items-center space-x-2">
          <Badge variant="success" size="sm" className="animate-bounce-gentle">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Response Sent
          </Badge>
          <span className="text-sm text-green-600">Successfully delivered to patient</span>
        </div>
        
        {onShowShortcuts && (
          <Tooltip content={`Keyboard shortcuts (${defaultActionConfig.keyboard.help})`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowShortcuts}
              className="state-transition hover:state-glow text-gray-500"
            >
              {getActionIcon('help')}
            </Button>
          </Tooltip>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between pt-3 border-t border-gray-200 animate-fade-in ${className}`}>
      {/* Primary Action Buttons */}
      <div className="flex space-x-2">
        {actions.showApprove && (
          <Tooltip content={`Approve & send response (${defaultActionConfig.keyboard.approve})`}>
            <Button
              variant={getButtonVariant('approve')}
              size="sm"
              onClick={onApprove}
              disabled={isLoading || !hasValidation}
              className={`state-transition ${hasValidation ? 'hover:animate-bounce-gentle' : ''}`}
            >
              {getActionIcon('approve')}
              <span className="ml-1">Approve & Send</span>
            </Button>
          </Tooltip>
        )}

        {actions.showSaveDraft && (
          <Tooltip content={`Save draft changes (${defaultActionConfig.keyboard.approve})`}>
            <Button
              variant={getButtonVariant('save')}
              size="sm"
              onClick={onSaveDraft}
              disabled={isLoading || !hasValidation}
              className={`state-transition ${hasValidation ? 'hover:animate-bounce-gentle' : ''}`}
            >
              {getActionIcon('save')}
              <span className="ml-1">Save Changes</span>
            </Button>
          </Tooltip>
        )}

        {actions.showEdit && (
          <Tooltip content={`Edit response (${defaultActionConfig.keyboard.edit})`}>
            <Button
              variant={getButtonVariant('edit')}
              size="sm"
              onClick={onEdit}
              disabled={isLoading}
              className="state-transition hover:state-glow"
            >
              {getActionIcon('edit')}
              <span className="ml-1">Edit</span>
            </Button>
          </Tooltip>
        )}
      </div>

      {/* Secondary/Escalation Actions */}
      <div className="flex items-center space-x-2">
        {actions.showForward && (
          <Tooltip content="Forward to supervisor for review">
            <Button
              variant={getButtonVariant('forward')}
              size="sm"
              onClick={onForwardSupervisor}
              disabled={isLoading}
              className="state-transition hover:state-glow-warning"
            >
              {getActionIcon('forward')}
              <span className="ml-1">Forward</span>
            </Button>
          </Tooltip>
        )}

        {actions.showEscalate && (
          <Tooltip content="Escalate case for clinical review">
            <Button
              variant={getButtonVariant('escalate')}
              size="sm"
              onClick={onEscalate}
              disabled={isLoading}
              className="state-transition hover:state-glow-warning"
            >
              {getActionIcon('escalate')}
              <span className="ml-1">Escalate</span>
            </Button>
          </Tooltip>
        )}

        {actions.showClinicalReview && (
          <Tooltip content="Request clinical staff review">
            <Button
              variant={getButtonVariant('review')}
              size="sm"
              onClick={onRequestReview}
              disabled={isLoading}
              className="state-transition hover:state-glow-warning"
            >
              {getActionIcon('review')}
              <span className="ml-1">Clinical Review</span>
              {isClinicalCase && (
                <Badge variant="warning" size="sm" className="ml-1">
                  Required
                </Badge>
              )}
            </Button>
          </Tooltip>
        )}

        {onShowShortcuts && (
          <Tooltip content={`Keyboard shortcuts (${defaultActionConfig.keyboard.help})`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowShortcuts}
              className="state-transition hover:state-glow text-gray-500"
            >
              {getActionIcon('help')}
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default ResponseActionButtons;
