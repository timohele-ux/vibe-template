import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Case, Patient, Message, AIResponse, User, DashboardMetrics, QueueFilters } from '../types';
import { mockCases, mockUsers, mockMetrics } from '../mockData';
import { healthcareScenarios, createRealisticConversation, extendedPatientProfiles } from './enhancedMockData';

// Custom hook for case management
export const useCases = (initialCases: Case[] = mockCases) => {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call for fetching cases
  const fetchCases = useCallback(async (filters?: QueueFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredCases = [...mockCases];
      
      if (filters) {
        if (filters.priority?.length) {
          filteredCases = filteredCases.filter(c => filters.priority!.includes(c.priority));
        }
        if (filters.status?.length) {
          filteredCases = filteredCases.filter(c => filters.status!.includes(c.status));
        }
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredCases = filteredCases.filter(c => 
            c.patient.firstName.toLowerCase().includes(query) ||
            c.patient.lastName.toLowerCase().includes(query) ||
            c.subject.toLowerCase().includes(query) ||
            c.summary.toLowerCase().includes(query)
          );
        }
        if (filters.assignedTo?.length) {
          filteredCases = filteredCases.filter(c => 
            c.assignedTo && filters.assignedTo!.includes(c.assignedTo)
          );
        }
        if (filters.timeRange) {
          filteredCases = filteredCases.filter(c => 
            c.createdAt >= filters.timeRange!.start && 
            c.createdAt <= filters.timeRange!.end
          );
        }
      }
      
      setCases(filteredCases);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCase = useCallback((newCase: Case) => {
    setCases(prev => [newCase, ...prev]);
  }, []);

  const updateCase = useCallback((caseId: string, updates: Partial<Case>) => {
    setCases(prev => prev.map(c => 
      c.id === caseId 
        ? { ...c, ...updates, updatedAt: new Date() }
        : c
    ));
  }, []);

  const removeCase = useCallback((caseId: string) => {
    setCases(prev => prev.filter(c => c.id !== caseId));
  }, []);

  return {
    cases,
    loading,
    error,
    fetchCases,
    addCase,
    updateCase,
    removeCase
  };
};

// Custom hook for message management
export const useMessages = (caseId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  // Load messages for a case
  useEffect(() => {
    const case_ = mockCases.find(c => c.id === caseId);
    if (case_) {
      setMessages(case_.messages);
    }
  }, [caseId]);

  const sendMessage = useCallback(async (content: string, senderType: 'patient' | 'staff' | 'ai' = 'staff') => {
    setSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        timestamp: new Date(),
        senderType,
        senderId: senderType === 'staff' ? 'user-1' : senderType === 'ai' ? 'ai-1' : 'patient-1',
        senderName: senderType === 'staff' ? 'Dr. Johnson' : senderType === 'ai' ? 'AI Assistant' : 'Patient',
        isRead: senderType !== 'patient',
        sentiment: 'neutral'
      };

      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      throw new Error('Failed to send message');
    } finally {
      setSending(false);
    }
  }, []);

  const markAsRead = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isRead: true } : m
    ));
  }, []);

  return {
    messages,
    sending,
    sendMessage,
    markAsRead
  };
};

// Custom hook for AI response management
export const useAIResponses = () => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAIResponse = useCallback(async (caseId: string, context?: string): Promise<AIResponse> => {
    setGenerating(true);
    setError(null);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate different confidence levels based on context
      const hasComplexTerms = context?.toLowerCase().includes('chest pain') || 
                             context?.toLowerCase().includes('emergency') ||
                             context?.toLowerCase().includes('severe');
      
      const confidence = hasComplexTerms ? 'low' : Math.random() > 0.3 ? 'high' : 'medium';
      const confidenceScore = confidence === 'high' ? 85 + Math.random() * 15 :
                             confidence === 'medium' ? 60 + Math.random() * 25 :
                             40 + Math.random() * 20;

      // Generate contextual response based on healthcare scenarios
      const responses = {
        high: [
          "Based on your symptoms and medical history, I recommend scheduling a follow-up appointment within the next week. Please continue your current medication regimen and monitor for any changes.",
          "I can help you with that prescription refill. I've sent the request to your pharmacy and it should be ready for pickup within 2 hours.",
          "Your lab results are within normal ranges. Please continue with your current treatment plan and we'll recheck in 3 months."
        ],
        medium: [
          "I understand your concerns about these symptoms. While they could be related to your medication, I'd recommend discussing this with your healthcare provider for proper evaluation.",
          "Based on your description, this appears to be a common side effect. However, let's schedule you for an appointment to assess this properly.",
          "Your question about medication timing is important. Let me connect you with a clinical pharmacist who can provide detailed guidance."
        ],
        low: [
          "Thank you for your message. Your situation requires clinical judgment that I cannot provide. I'm connecting you with one of our healthcare providers for proper assessment.",
          "This involves multiple medical factors that require professional evaluation. Let me escalate this to our medical team for review.",
          "I want to ensure you receive the most appropriate care. Let me have one of our clinicians review your case personally."
        ]
      };

      const responseContent = responses[confidence][Math.floor(Math.random() * responses[confidence].length)];
      
      const aiResponse: AIResponse = {
        id: `ai-${Date.now()}`,
        caseId,
        content: responseContent,
        confidence,
        confidenceScore: Math.round(confidenceScore),
        clinicalReasoning: confidence === 'high' 
          ? "Patient inquiry matches standard protocols. Medical history reviewed. No contraindications identified."
          : confidence === 'medium'
          ? "Symptoms require clinical correlation. Patient history suggests further evaluation needed."
          : "Complex case requiring direct clinical assessment. Multiple variables outside AI confidence threshold.",
        suggestedActions: confidence === 'high'
          ? ["Send response to patient", "Schedule follow-up if needed"]
          : confidence === 'medium'
          ? ["Review with clinical staff", "Consider appointment scheduling"]
          : ["Escalate to healthcare provider", "Direct clinical consultation required"],
        riskAssessment: {
          level: hasComplexTerms ? 'high' : confidence === 'high' ? 'low' : 'medium',
          factors: hasComplexTerms 
            ? ["Urgent symptoms reported", "Requires immediate attention"]
            : ["Standard risk profile", "Routine follow-up appropriate"]
        },
        generatedAt: new Date(),
        isApproved: false
      };

      return aiResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI response');
      throw err;
    } finally {
      setGenerating(false);
    }
  }, []);

  const approveAIResponse = useCallback(async (responseId: string, modifications?: string[]) => {
    // Simulate approval process
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
  }, []);

  const rejectAIResponse = useCallback(async (responseId: string, reason: string) => {
    // Simulate rejection process
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
  }, []);

  return {
    generating,
    error,
    generateAIResponse,
    approveAIResponse,
    rejectAIResponse
  };
};

// Custom hook for patient data management
export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>(extendedPatientProfiles);
  const [loading, setLoading] = useState(false);

  const getPatientById = useCallback((patientId: string) => {
    return patients.find(p => p.id === patientId);
  }, [patients]);

  const updatePatient = useCallback((patientId: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, ...updates } : p
    ));
  }, []);

  const searchPatients = useCallback(async (query: string): Promise<Patient[]> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = patients.filter(p => 
      p.firstName.toLowerCase().includes(query.toLowerCase()) ||
      p.lastName.toLowerCase().includes(query.toLowerCase()) ||
      p.email?.toLowerCase().includes(query.toLowerCase()) ||
      p.phone?.includes(query)
    );
    
    setLoading(false);
    return results;
  }, [patients]);

  return {
    patients,
    loading,
    getPatientById,
    updatePatient,
    searchPatients
  };
};

// Custom hook for dashboard metrics
export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [loading, setLoading] = useState(false);

  const refreshMetrics = useCallback(async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate realistic metrics based on current time
      const now = new Date();
      const hour = now.getHours();
      const isBusinessHours = hour >= 8 && hour <= 17;
      
      const updatedMetrics: DashboardMetrics = {
        totalCases: Math.floor(Math.random() * 50) + 150,
        pendingCases: Math.floor(Math.random() * 20) + 5,
        averageResponseTime: Math.floor(Math.random() * 30) + (isBusinessHours ? 15 : 45),
        satisfactionScore: 4.2 + Math.random() * 0.6,
        aiApprovalRate: 0.82 + Math.random() * 0.15,
        escalationRate: 0.05 + Math.random() * 0.03,
        casesResolvedToday: Math.floor(Math.random() * 25) + (isBusinessHours ? 15 : 5),
        activeStaffCount: Math.floor(Math.random() * 5) + (isBusinessHours ? 8 : 3)
      };
      
      setMetrics(updatedMetrics);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshMetrics, 30000);
    return () => clearInterval(interval);
  }, [refreshMetrics]);

  return {
    metrics,
    loading,
    refreshMetrics
  };
};

// Custom hook for queue filtering and sorting
export const useQueueFilters = () => {
  const [filters, setFilters] = useState<QueueFilters>({});
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const updateFilters = useCallback((newFilters: Partial<QueueFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const appliedFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  }, [filters]);

  const sortCases = useCallback((cases: Case[]) => {
    return [...cases].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { critical: 4, urgent: 3, routine: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [sortBy, sortOrder]);

  return {
    filters,
    sortBy,
    sortOrder,
    appliedFiltersCount,
    updateFilters,
    clearFilters,
    setSortBy,
    setSortOrder,
    sortCases
  };
};

// Custom hook for real-time notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    caseId?: string;
  }>>([]);

  const addNotification = useCallback((notification: {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    caseId?: string;
  }) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      ...notification,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };
};

export default {
  useCases,
  useMessages,
  useAIResponses,
  usePatients,
  useDashboardMetrics,
  useQueueFilters,
  useNotifications
};
