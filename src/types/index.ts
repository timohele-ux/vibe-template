// Core type definitions for MediReply healthcare communication platform

export type Priority = 'critical' | 'urgent' | 'routine' | 'low';
export type CaseStatus = 'new' | 'in-progress' | 'awaiting-approval' | 'resolved' | 'escalated';
export type SenderType = 'patient' | 'staff' | 'ai' | 'system';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type UserRole = 'admin' | 'clinician' | 'support' | 'viewer';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  insuranceId?: string;
  preferredLanguage?: string;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    phone: boolean;
    portal: boolean;
  };
  medicalInfo: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    lastVisit?: string;
  };
  riskFlags: string[];
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderType: SenderType;
  senderId: string;
  senderName: string;
  isRead: boolean;
  attachments?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Case {
  id: string;
  patientId: string;
  patient: Patient;
  subject: string;
  summary: string;
  priority: Priority;
  status: CaseStatus;
  category: string;
  tags: string[];
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  aiResponses: AIResponse[];
  estimatedResponseTime?: number;
  actualResponseTime?: number;
  satisfactionScore?: number;
}

export interface AIResponse {
  id: string;
  caseId: string;
  content: string;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0-100
  clinicalReasoning: string;
  suggestedActions: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  generatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  isApproved: boolean;
  modifications?: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  isOnline: boolean;
  lastActive: Date;
  permissions: {
    canApproveAI: boolean;
    canEscalate: boolean;
    canViewAllCases: boolean;
    canModifySettings: boolean;
  };
  preferences: {
    notifications: boolean;
    soundAlerts: boolean;
    autoAssign: boolean;
  };
}

export interface QueueFilters {
  priority?: Priority[];
  status?: CaseStatus[];
  department?: string[];
  timeRange?: {
    start: Date;
    end: Date;
  };
  assignedTo?: string[];
  searchQuery?: string;
}

export interface DashboardMetrics {
  totalCases: number;
  pendingCases: number;
  averageResponseTime: number;
  satisfactionScore: number;
  aiApprovalRate: number;
  escalationRate: number;
  casesResolvedToday: number;
  activeStaffCount: number;
}

// Component-specific types
export interface ConfidenceScoreProps {
  score: number;
  level: ConfidenceLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface PriorityTagProps {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
}

export interface StatusIndicatorProps {
  status: CaseStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}
