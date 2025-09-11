import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { Case, AIResponse, SuggestedResource, EditRecord, ResponseState, EditReason, UserRole } from '../types';

// Workflow flags for tracking conversation status
export interface WorkflowFlags {
  requiresClinicalReview: boolean;
  isEscalated: boolean;
  hasPendingApproval: boolean;
  isHighPriority: boolean;
  hasEditHistory: boolean;
  isAuditRequired: boolean;
  supervisorAssigned?: string;
  clinicalReviewerId?: string;
  lastActivity: Date;
}

// Comprehensive conversation state interface
export interface ConversationState {
  activeConversation: Case | null;
  responseState: ResponseState;
  editHistory: EditRecord[];
  suggestedResources: SuggestedResource[];
  workflowFlags: WorkflowFlags;
  currentUser: {
    id: string;
    role: UserRole;
    name: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

// Action types for state management
export type ConversationAction =
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: Case | null }
  | { type: 'UPDATE_RESPONSE_STATE'; payload: Partial<ResponseState> }
  | { type: 'ADD_EDIT_RECORD'; payload: EditRecord }
  | { type: 'SET_SUGGESTED_RESOURCES'; payload: SuggestedResource[] }
  | { type: 'UPDATE_WORKFLOW_FLAGS'; payload: Partial<WorkflowFlags> }
  | { type: 'SET_CURRENT_USER'; payload: ConversationState['currentUser'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_EDIT_HISTORY' }
  | { type: 'ESCALATE_CONVERSATION'; payload: { reason: string; supervisorId?: string } }
  | { type: 'REQUEST_CLINICAL_REVIEW'; payload: { reviewerId?: string; priority: 'normal' | 'urgent' } }
  | { type: 'APPROVE_RESPONSE'; payload: { responseId: string; approverId: string } }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: ConversationState = {
  activeConversation: null,
  responseState: {
    mode: 'pending',
    isModified: false,
    originalContent: '',
    currentContent: ''
  },
  editHistory: [],
  suggestedResources: [],
  workflowFlags: {
    requiresClinicalReview: false,
    isEscalated: false,
    hasPendingApproval: false,
    isHighPriority: false,
    hasEditHistory: false,
    isAuditRequired: false,
    lastActivity: new Date()
  },
  currentUser: null,
  isLoading: false,
  error: null
};

// Reducer for state management
function conversationReducer(state: ConversationState, action: ConversationAction): ConversationState {
  switch (action.type) {
    case 'SET_ACTIVE_CONVERSATION':
      return {
        ...state,
        activeConversation: action.payload,
        responseState: action.payload ? {
          mode: 'pending',
          isModified: false,
          originalContent: action.payload.aiResponses[0]?.content || '',
          currentContent: action.payload.aiResponses[0]?.content || ''
        } : initialState.responseState,
        workflowFlags: {
          ...state.workflowFlags,
          requiresClinicalReview: action.payload?.category === 'clinical' || action.payload?.priority === 'critical' || false,
          isHighPriority: action.payload?.priority === 'critical' || action.payload?.priority === 'urgent' || false,
          lastActivity: new Date()
        }
      };

    case 'UPDATE_RESPONSE_STATE':
      return {
        ...state,
        responseState: { ...state.responseState, ...action.payload },
        workflowFlags: {
          ...state.workflowFlags,
          lastActivity: new Date()
        }
      };

    case 'ADD_EDIT_RECORD':
      const newEditHistory = [...state.editHistory, action.payload];
      return {
        ...state,
        editHistory: newEditHistory,
        workflowFlags: {
          ...state.workflowFlags,
          hasEditHistory: true,
          isAuditRequired: true,
          lastActivity: new Date()
        }
      };

    case 'SET_SUGGESTED_RESOURCES':
      return {
        ...state,
        suggestedResources: action.payload
      };

    case 'UPDATE_WORKFLOW_FLAGS':
      return {
        ...state,
        workflowFlags: { 
          ...state.workflowFlags, 
          ...action.payload,
          lastActivity: new Date()
        }
      };

    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'CLEAR_EDIT_HISTORY':
      return {
        ...state,
        editHistory: [],
        workflowFlags: {
          ...state.workflowFlags,
          hasEditHistory: false,
          lastActivity: new Date()
        }
      };

    case 'ESCALATE_CONVERSATION':
      return {
        ...state,
        workflowFlags: {
          ...state.workflowFlags,
          isEscalated: true,
          supervisorAssigned: action.payload.supervisorId,
          lastActivity: new Date()
        }
      };

    case 'REQUEST_CLINICAL_REVIEW':
      return {
        ...state,
        workflowFlags: {
          ...state.workflowFlags,
          requiresClinicalReview: true,
          clinicalReviewerId: action.payload.reviewerId,
          isHighPriority: action.payload.priority === 'urgent',
          lastActivity: new Date()
        }
      };

    case 'APPROVE_RESPONSE':
      return {
        ...state,
        responseState: { ...state.responseState, mode: 'resolved' },
        workflowFlags: {
          ...state.workflowFlags,
          hasPendingApproval: false,
          lastActivity: new Date()
        }
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context creation
const ConversationStateContext = createContext<{
  state: ConversationState;
  dispatch: React.Dispatch<ConversationAction>;
  actions: {
    setActiveConversation: (conversation: Case | null) => void;
    updateResponseState: (updates: Partial<ResponseState>) => void;
    addEditRecord: (record: Omit<EditRecord, 'id' | 'timestamp'>) => void;
    setSuggestedResources: (resources: SuggestedResource[]) => void;
    updateWorkflowFlags: (flags: Partial<WorkflowFlags>) => void;
    escalateConversation: (reason: string, supervisorId?: string) => void;
    requestClinicalReview: (reviewerId?: string, priority?: 'normal' | 'urgent') => void;
    approveResponse: (responseId: string) => void;
    clearEditHistory: () => void;
    resetState: () => void;
  };
} | null>(null);

// Provider component
export const ConversationStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(conversationReducer, initialState);

  // Action creators for easier usage
  const actions = {
    setActiveConversation: useCallback((conversation: Case | null) => {
      dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversation });
    }, []),

    updateResponseState: useCallback((updates: Partial<ResponseState>) => {
      dispatch({ type: 'UPDATE_RESPONSE_STATE', payload: updates });
    }, []),

    addEditRecord: useCallback((record: Omit<EditRecord, 'id' | 'timestamp'>) => {
      const editRecord: EditRecord = {
        ...record,
        id: `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_EDIT_RECORD', payload: editRecord });
    }, []),

    setSuggestedResources: useCallback((resources: SuggestedResource[]) => {
      dispatch({ type: 'SET_SUGGESTED_RESOURCES', payload: resources });
    }, []),

    updateWorkflowFlags: useCallback((flags: Partial<WorkflowFlags>) => {
      dispatch({ type: 'UPDATE_WORKFLOW_FLAGS', payload: flags });
    }, []),

    escalateConversation: useCallback((reason: string, supervisorId?: string) => {
      dispatch({ type: 'ESCALATE_CONVERSATION', payload: { reason, supervisorId } });
    }, []),

    requestClinicalReview: useCallback((reviewerId?: string, priority: 'normal' | 'urgent' = 'normal') => {
      dispatch({ type: 'REQUEST_CLINICAL_REVIEW', payload: { reviewerId, priority } });
    }, []),

    approveResponse: useCallback((responseId: string) => {
      if (!state.currentUser) return;
      dispatch({ type: 'APPROVE_RESPONSE', payload: { responseId, approverId: state.currentUser.id } });
    }, [state.currentUser]),

    clearEditHistory: useCallback(() => {
      dispatch({ type: 'CLEAR_EDIT_HISTORY' });
    }, []),

    resetState: useCallback(() => {
      dispatch({ type: 'RESET_STATE' });
    }, [])
  };

  // Auto-save to localStorage for persistence
  useEffect(() => {
    if (state.activeConversation) {
      const persistData = {
        conversationId: state.activeConversation.id,
        responseState: state.responseState,
        editHistory: state.editHistory,
        workflowFlags: state.workflowFlags
      };
      localStorage.setItem('conversationState', JSON.stringify(persistData));
    }
  }, [state.activeConversation, state.responseState, state.editHistory, state.workflowFlags]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('conversationState');
      if (saved) {
        const persistData = JSON.parse(saved);
        dispatch({ type: 'UPDATE_RESPONSE_STATE', payload: persistData.responseState });
        persistData.editHistory.forEach((record: EditRecord) => {
          dispatch({ type: 'ADD_EDIT_RECORD', payload: record });
        });
        dispatch({ type: 'UPDATE_WORKFLOW_FLAGS', payload: persistData.workflowFlags });
      }
    } catch (error) {
      console.warn('Failed to load conversation state from localStorage:', error);
    }
  }, []);

  return (
    <ConversationStateContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </ConversationStateContext.Provider>
  );
};

// Custom hook for using conversation state
export const useConversationState = () => {
  const context = useContext(ConversationStateContext);
  if (!context) {
    throw new Error('useConversationState must be used within a ConversationStateProvider');
  }
  return context;
};

// Selector hooks for specific state pieces
export const useActiveConversation = () => {
  const { state } = useConversationState();
  return state.activeConversation;
};

export const useResponseState = () => {
  const { state, actions } = useConversationState();
  return { 
    responseState: state.responseState, 
    updateResponseState: actions.updateResponseState 
  };
};

export const useEditHistory = () => {
  const { state, actions } = useConversationState();
  return { 
    editHistory: state.editHistory, 
    addEditRecord: actions.addEditRecord,
    clearEditHistory: actions.clearEditHistory
  };
};

export const useWorkflowFlags = () => {
  const { state, actions } = useConversationState();
  return { 
    workflowFlags: state.workflowFlags, 
    updateWorkflowFlags: actions.updateWorkflowFlags 
  };
};

export const useSuggestedResources = () => {
  const { state, actions } = useConversationState();
  return { 
    suggestedResources: state.suggestedResources, 
    setSuggestedResources: actions.setSuggestedResources 
  };
};

// Audit trail helper hooks
export const useAuditTrail = () => {
  const { state } = useConversationState();
  
  const getAuditSummary = useCallback(() => {
    return {
      totalEdits: state.editHistory.length,
      lastEdit: state.editHistory[state.editHistory.length - 1]?.timestamp,
      editReasons: state.editHistory.map(record => record.reason),
      isAuditRequired: state.workflowFlags.isAuditRequired,
      hasEscalations: state.workflowFlags.isEscalated
    };
  }, [state.editHistory, state.workflowFlags]);

  const getEditsByUser = useCallback((userId: string) => {
    return state.editHistory.filter(record => record.userId === userId);
  }, [state.editHistory]);

  const getEditsByReason = useCallback((reason: EditReason) => {
    return state.editHistory.filter(record => record.reason === reason);
  }, [state.editHistory]);

  return {
    getAuditSummary,
    getEditsByUser,
    getEditsByReason,
    fullHistory: state.editHistory
  };
};

export default ConversationStateProvider;
