import type { Case, Patient, Message, DashboardMetrics, User } from './types';

// Mock Patients
const mockPatients: Patient[] = [
  {
    id: 'p1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1985-03-15',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    insuranceId: 'INS123456',
    preferredLanguage: 'en',
    communicationPreferences: {
      email: true,
      sms: false,
      phone: true,
      portal: true
    },
    medicalInfo: {
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      medications: ['Metformin 500mg', 'Lisinopril 10mg'],
      allergies: ['Penicillin'],
      lastVisit: '2024-08-15'
    },
    riskFlags: ['Multiple medications']
  },
  {
    id: 'p2',
    firstName: 'Michael',
    lastName: 'Chen',
    dateOfBirth: '1978-11-22',
    email: 'michael.chen@email.com',
    phone: '+1-555-0124',
    insuranceId: 'INS123457',
    preferredLanguage: 'en',
    communicationPreferences: {
      email: true,
      sms: true,
      phone: false,
      portal: true
    },
    medicalInfo: {
      conditions: ['Asthma'],
      medications: ['Albuterol Inhaler'],
      allergies: [],
      lastVisit: '2024-09-01'
    },
    riskFlags: []
  },
  {
    id: 'p3',
    firstName: 'Emma',
    lastName: 'Williams',
    dateOfBirth: '1992-07-08',
    email: 'emma.williams@email.com',
    phone: '+1-555-0125',
    insuranceId: 'INS123458',
    preferredLanguage: 'en',
    communicationPreferences: {
      email: true,
      sms: true,
      phone: true,
      portal: false
    },
    medicalInfo: {
      conditions: [],
      medications: [],
      allergies: ['Shellfish'],
      lastVisit: '2024-08-30'
    },
    riskFlags: []
  }
];

// Mock Messages
const createMessages = (patientName: string, caseId: string): Message[] => [
  {
    id: `msg-${caseId}-1`,
    content: `Hi, I'm experiencing some concerning symptoms and would like to schedule an appointment as soon as possible.`,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    senderType: 'patient',
    senderId: 'p1',
    senderName: patientName,
    isRead: false,
    sentiment: 'neutral'
  },
  {
    id: `msg-${caseId}-2`,
    content: `Thank you for reaching out. I've reviewed your message and understand your concerns. Based on your symptoms, I'd recommend we schedule you for an appointment this week. Are you available Tuesday morning?`,
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    senderType: 'ai',
    senderId: 'ai-1',
    senderName: 'AI Assistant',
    isRead: true,
    sentiment: 'positive'
  }
];

// Mock Cases
export const mockCases: Case[] = [
  {
    id: 'case-1',
    patientId: 'p1',
    patient: mockPatients[0],
    subject: 'Urgent: Chest pain and shortness of breath',
    summary: 'Patient reports chest discomfort and difficulty breathing that started 2 hours ago',
    priority: 'critical',
    status: 'new',
    category: 'Emergency',
    tags: ['chest-pain', 'breathing', 'urgent'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    messages: createMessages('Sarah Johnson', 'case-1'),
    aiResponses: [],
    estimatedResponseTime: 5,
    satisfactionScore: undefined
  },
  {
    id: 'case-2',
    patientId: 'p2',
    patient: mockPatients[1],
    subject: 'Prescription refill request - Albuterol inhaler',
    summary: 'Patient needs refill for asthma medication, current inhaler is running low',
    priority: 'routine',
    status: 'in-progress',
    category: 'Medication',
    tags: ['prescription', 'asthma', 'refill'],
    assignedTo: 'dr-smith',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    messages: createMessages('Michael Chen', 'case-2'),
    aiResponses: [],
    estimatedResponseTime: 30,
    satisfactionScore: undefined
  },
  {
    id: 'case-3',
    patientId: 'p3',
    patient: mockPatients[2],
    subject: 'Appointment scheduling - Annual physical',
    summary: 'Patient would like to schedule annual physical exam and discuss wellness plan',
    priority: 'routine',
    status: 'awaiting-approval',
    category: 'Appointments',
    tags: ['physical', 'wellness', 'routine'],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    messages: createMessages('Emma Williams', 'case-3'),
    aiResponses: [],
    estimatedResponseTime: 45,
    satisfactionScore: undefined
  },
  {
    id: 'case-4',
    patientId: 'p1',
    patient: mockPatients[0],
    subject: 'Blood pressure medication side effects',
    summary: 'Patient experiencing dizziness and fatigue, suspects related to BP medication',
    priority: 'urgent',
    status: 'escalated',
    category: 'Cardiology',
    tags: ['medication', 'side-effects', 'hypertension'],
    assignedTo: 'dr-wilson',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messages: createMessages('Sarah Johnson', 'case-4'),
    aiResponses: [],
    estimatedResponseTime: 15,
    satisfactionScore: undefined
  },
  {
    id: 'case-5',
    patientId: 'p2',
    patient: mockPatients[1],
    subject: 'Lab results follow-up',
    summary: 'Recent blood work shows elevated cholesterol, patient wants to discuss next steps',
    priority: 'routine',
    status: 'resolved',
    category: 'Lab Results',
    tags: ['lab-results', 'cholesterol', 'follow-up'],
    assignedTo: 'dr-smith',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    messages: createMessages('Michael Chen', 'case-5'),
    aiResponses: [],
    estimatedResponseTime: 60,
    actualResponseTime: 45,
    satisfactionScore: 4.5
  }
];

// Mock Dashboard Metrics
export const mockMetrics: DashboardMetrics = {
  totalCases: 25,
  pendingCases: 12,
  averageResponseTime: 28,
  satisfactionScore: 4.3,
  aiApprovalRate: 85.5,
  escalationRate: 12.3,
  casesResolvedToday: 8,
  activeStaffCount: 6
};

// Mock Current User
export const mockCurrentUser: User = {
  id: 'user-1',
  firstName: 'Dr. Sarah',
  lastName: 'Johnson',
  email: 'dr.johnson@medireply.com',
  role: 'clinician',
  department: 'General Medicine',
  isOnline: true,
  lastActive: new Date(),
  permissions: {
    canApproveAI: true,
    canEscalate: true,
    canViewAllCases: true,
    canModifySettings: false
  },
  preferences: {
    notifications: true,
    soundAlerts: true,
    autoAssign: false
  }
};
