import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Case, User, DashboardMetrics, Message, AIResponse } from '../types';

// Dashboard State Interface
interface DashboardState {
  cases: Case[];
  selectedCaseId: string | null;
  currentUser: User | null;
  metrics: DashboardMetrics;
  isLoading: boolean;
  error: string | null;
  notifications: Notification[];
  realTimeUpdates: boolean;
  queueFilters: {
    search: string;
    priority: string[];
    status: string[];
    assignedTo: string[];
  };
}

// Notification Interface
interface Notification {
  id: string;
  type: 'urgent' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  caseId?: string;
}

// Action Types
type DashboardAction =
  | { type: 'SET_CASES'; payload: Case[] }
  | { type: 'ADD_CASE'; payload: Case }
  | { type: 'UPDATE_CASE'; payload: { caseId: string; updates: Partial<Case> } }
  | { type: 'SELECT_CASE'; payload: string | null }
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_METRICS'; payload: DashboardMetrics }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'TOGGLE_REAL_TIME'; payload: boolean }
  | { type: 'UPDATE_QUEUE_FILTERS'; payload: Partial<DashboardState['queueFilters']> }
  | { type: 'ADD_MESSAGE'; payload: { caseId: string; message: Message } }
  | { type: 'ADD_AI_RESPONSE'; payload: { caseId: string; response: AIResponse } }
  | { type: 'APPROVE_AI_RESPONSE'; payload: { caseId: string; responseId: string; approvedBy: string } }
  | { type: 'REJECT_AI_RESPONSE'; payload: { caseId: string; responseId: string } }
  | { type: 'UPDATE_CASE_STATUS'; payload: { caseId: string; status: Case['status'] } };

// Initial State
const initialState: DashboardState = {
  cases: [],
  selectedCaseId: null,
  currentUser: null,
  metrics: {
    totalCases: 0,
    pendingCases: 0,
    averageResponseTime: 0,
    satisfactionScore: 0,
    aiApprovalRate: 0,
    escalationRate: 0,
    casesResolvedToday: 0,
    activeStaffCount: 0,
  },
  isLoading: true,
  error: null,
  notifications: [],
  realTimeUpdates: true,
  queueFilters: {
    search: '',
    priority: [],
    status: [],
    assignedTo: [],
  },
};

// Reducer
const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_CASES':
      return { ...state, cases: action.payload, isLoading: false };

    case 'ADD_CASE':
      return { ...state, cases: [action.payload, ...state.cases] };

    case 'UPDATE_CASE':
      return {
        ...state,
        cases: state.cases.map(case_ =>
          case_.id === action.payload.caseId
            ? { ...case_, ...action.payload.updates, updatedAt: new Date() }
            : case_
        ),
      };

    case 'SELECT_CASE':
      return { ...state, selectedCaseId: action.payload };

    case 'SET_USER':
      return { ...state, currentUser: action.payload };

    case 'UPDATE_METRICS':
      return { ...state, metrics: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications.slice(0, 49)], // Keep last 50
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, isRead: true } : notif
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    case 'TOGGLE_REAL_TIME':
      return { ...state, realTimeUpdates: action.payload };

    case 'UPDATE_QUEUE_FILTERS':
      return {
        ...state,
        queueFilters: { ...state.queueFilters, ...action.payload },
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        cases: state.cases.map(case_ =>
          case_.id === action.payload.caseId
            ? { ...case_, messages: [...case_.messages, action.payload.message], updatedAt: new Date() }
            : case_
        ),
      };

    case 'ADD_AI_RESPONSE':
      return {
        ...state,
        cases: state.cases.map(case_ =>
          case_.id === action.payload.caseId
            ? { ...case_, aiResponses: [...case_.aiResponses, action.payload.response], updatedAt: new Date() }
            : case_
        ),
      };

    case 'APPROVE_AI_RESPONSE':
      return {
        ...state,
        cases: state.cases.map(case_ =>
          case_.id === action.payload.caseId
            ? {
                ...case_,
                aiResponses: case_.aiResponses.map(response =>
                  response.id === action.payload.responseId
                    ? { ...response, isApproved: true, approvedBy: action.payload.approvedBy, approvedAt: new Date() }
                    : response
                ),
                updatedAt: new Date(),
              }
            : case_
        ),
      };

    case 'REJECT_AI_RESPONSE':
      return {
        ...state,
        cases: state.cases.map(case_ =>
          case_.id === action.payload.caseId
            ? {
                ...case_,
                aiResponses: case_.aiResponses.filter(response => response.id !== action.payload.responseId),
                updatedAt: new Date(),
              }
            : case_
        ),
      };

    case 'UPDATE_CASE_STATUS':
      return {
        ...state,
        cases: state.cases.map(case_ =>
          case_.id === action.payload.caseId
            ? { ...case_, status: action.payload.status, updatedAt: new Date() }
            : case_
        ),
      };

    default:
      return state;
  }
};

// Context
const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
} | null>(null);

// Provider Component
interface DashboardProviderProps {
  children: ReactNode;
  initialCases?: Case[];
  initialUser?: User;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
  initialCases = [],
  initialUser,
}) => {
  const [state, dispatch] = useReducer(dashboardReducer, {
    ...initialState,
    cases: initialCases,
    currentUser: initialUser || null,
  });

  // Mock real-time updates
  useEffect(() => {
    if (!state.realTimeUpdates) return;

    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      const updatedMetrics: DashboardMetrics = {
        totalCases: state.cases.length,
        pendingCases: state.cases.filter(c => c.status === 'new' || c.status === 'in-progress').length,
        averageResponseTime: Math.floor(Math.random() * 30) + 5, // 5-35 minutes
        satisfactionScore: 4.2 + Math.random() * 0.6, // 4.2-4.8
        aiApprovalRate: 0.85 + Math.random() * 0.1, // 85-95%
        escalationRate: 0.03 + Math.random() * 0.02, // 3-5%
        casesResolvedToday: state.cases.filter(c => 
          c.status === 'resolved' && 
          c.updatedAt.toDateString() === new Date().toDateString()
        ).length,
        activeStaffCount: Math.floor(Math.random() * 5) + 8, // 8-12 staff online
      };

      dispatch({ type: 'UPDATE_METRICS', payload: updatedMetrics });

      // Simulate urgent case notifications
      const urgentCases = state.cases.filter(c => c.priority === 'critical' && c.status === 'new');
      if (urgentCases.length > 0 && Math.random() < 0.1) { // 10% chance
        const case_ = urgentCases[Math.floor(Math.random() * urgentCases.length)];
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: `notif-${Date.now()}`,
            type: 'urgent',
            title: 'Critical Case Alert',
            message: `${case_.patient.firstName} ${case_.patient.lastName} - ${case_.subject}`,
            timestamp: new Date(),
            isRead: false,
            caseId: case_.id,
          },
        });
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [state.realTimeUpdates, state.cases]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom Hook
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Action Creators (Helper Functions)
export const dashboardActions = {
  setCases: (cases: Case[]) => ({ type: 'SET_CASES' as const, payload: cases }),
  
  addCase: (case_: Case) => ({ type: 'ADD_CASE' as const, payload: case_ }),
  
  selectCase: (caseId: string | null) => ({ type: 'SELECT_CASE' as const, payload: caseId }),
  
  sendMessage: (caseId: string, message: Message) => ({
    type: 'ADD_MESSAGE' as const,
    payload: { caseId, message },
  }),
  
  addAIResponse: (caseId: string, response: AIResponse) => ({
    type: 'ADD_AI_RESPONSE' as const,
    payload: { caseId, response },
  }),
  
  approveAIResponse: (caseId: string, responseId: string, approvedBy: string) => ({
    type: 'APPROVE_AI_RESPONSE' as const,
    payload: { caseId, responseId, approvedBy },
  }),
  
  rejectAIResponse: (caseId: string, responseId: string) => ({
    type: 'REJECT_AI_RESPONSE' as const,
    payload: { caseId, responseId },
  }),
  
  updateCaseStatus: (caseId: string, status: Case['status']) => ({
    type: 'UPDATE_CASE_STATUS' as const,
    payload: { caseId, status },
  }),
  
  updateQueueFilters: (filters: Partial<DashboardState['queueFilters']>) => ({
    type: 'UPDATE_QUEUE_FILTERS' as const,
    payload: filters,
  }),
  
  addNotification: (notification: Notification) => ({
    type: 'ADD_NOTIFICATION' as const,
    payload: notification,
  }),
  
  markNotificationRead: (notificationId: string) => ({
    type: 'MARK_NOTIFICATION_READ' as const,
    payload: notificationId,
  }),
  
  clearNotifications: () => ({ type: 'CLEAR_NOTIFICATIONS' as const }),
  
  toggleRealTime: (enabled: boolean) => ({ type: 'TOGGLE_REAL_TIME' as const, payload: enabled }),
};

export default DashboardContext;
