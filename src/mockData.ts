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
    aiResponses: [
      {
        id: 'ai-1-1',
        caseId: 'case-1',
        content: `I understand you're experiencing chest pain and shortness of breath. These symptoms require immediate medical attention.

Please go to your nearest emergency room immediately or call 911. Do not drive yourself - have someone drive you or call an ambulance.

While waiting for emergency care:
- Try to stay calm and rest in a comfortable position
- Do not take any medications unless prescribed by your doctor
- Have someone stay with you if possible

Your safety is our top priority. Please seek emergency care right away and follow up with us once you've been evaluated.`,
        confidence: 'high' as const,
        confidenceScore: 98,
        clinicalReasoning: 'High confidence emergency response. Chest pain and shortness of breath are red flag symptoms requiring immediate emergency evaluation to rule out cardiac events, pulmonary embolism, or other life-threatening conditions. Standard protocol is immediate emergency referral.',
        suggestedActions: [
          'Immediate emergency room referral',
          'Document emergency referral in patient chart',
          'Schedule follow-up after emergency evaluation'
        ],
        riskAssessment: {
          level: 'high' as const,
          factors: [
            'Acute chest pain symptoms',
            'Shortness of breath', 
            'Potential cardiac or pulmonary emergency',
            'Requires immediate medical evaluation'
          ]
        },
        generatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isApproved: false
      }
    ],
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
    aiResponses: [
      {
        id: 'ai-3-1',
        caseId: 'case-3',
        content: `Thank you for reaching out about scheduling your annual physical exam. I'd be happy to help you set up this important appointment.

Based on your insurance plan and our current availability, I can offer you the following appointment times:
- Monday, March 21st at 9:30 AM with Dr. Martinez
- Wednesday, March 23rd at 2:15 PM with Dr. Chen  
- Friday, March 25th at 10:45 AM with Dr. Martinez

Each appointment will include:
- Complete physical examination
- Routine lab work (blood panel, cholesterol screening)
- Wellness planning discussion
- Review of your medical history and medications

Would any of these times work for your schedule? Please let me know your preference, and I'll send you a confirmation with preparation instructions.`,
        confidence: 'high' as const,
        confidenceScore: 96,
        clinicalReasoning: 'High confidence response for routine appointment scheduling. Patient requesting standard annual physical with wellness discussion. Provided multiple specific appointment options with provider names and comprehensive service description.',
        suggestedActions: [
          'Check provider availability for proposed times',
          'Verify insurance coverage for annual physical',
          'Send appointment confirmation and prep instructions'
        ],
        riskAssessment: {
          level: 'low' as const,
          factors: ['Routine preventive care appointment', 'No urgent health concerns']
        },
        generatedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        isApproved: false
      },
      {
        id: 'ai-3-2',
        caseId: 'case-3',
        content: `I see you're interested in scheduling your annual wellness visit. Let me help you with that right away.

For your annual physical, we recommend scheduling with one of our primary care providers. Here are some available options:

**This Week:**
- Dr. Rodriguez: Thursday at 3:00 PM
- Dr. Kim: Friday at 11:15 AM

**Next Week:**  
- Dr. Martinez: Monday at 8:45 AM
- Dr. Chen: Wednesday at 1:30 PM

Your annual exam will cover preventive screenings appropriate for your age and health history. We'll also have time to discuss any health goals or concerns you might have.

Which appointment would work best for you?`,
        confidence: 'medium' as const,
        confidenceScore: 87,
        clinicalReasoning: 'Medium confidence alternative response for appointment scheduling. Different provider options and time slots offered. Slightly less detailed than first option but still comprehensive.',
        suggestedActions: [
          'Confirm provider availability',
          'Schedule chosen appointment slot', 
          'Send wellness visit preparation materials'
        ],
        riskAssessment: {
          level: 'low' as const,
          factors: ['Routine scheduling request', 'No medical urgency']
        },
        generatedAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
        isApproved: false
      }
    ],
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
  },
  // Historical cases for previous patient interactions
  {
    id: 'case-hist-1',
    patientId: 'p1', // Sarah Johnson
    patient: mockPatients[0],
    subject: 'Follow-up on chest X-ray results',
    summary: 'Patient inquired about recent chest X-ray findings and next steps',
    priority: 'urgent',
    status: 'resolved',
    category: 'Follow-up',
    tags: ['chest-xray', 'follow-up', 'results'],
    assignedTo: 'dr-martinez',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 'msg-hist-1-1',
        content: 'Hi, I got a call about my chest X-ray results. The nurse said the doctor wants to discuss them with me. Should I be worried?',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        senderType: 'patient',
        senderId: 'p1',
        senderName: 'Sarah Johnson',
        isRead: true,
        sentiment: 'negative'
      },
      {
        id: 'msg-hist-1-2',
        content: 'Thank you for reaching out, Sarah. I understand your concern about the X-ray results. The findings show some minor changes that we want to monitor, but nothing immediately alarming. Dr. Martinez would like to schedule a follow-up appointment to discuss the results in detail and create a monitoring plan. Would you be available this week for an appointment?',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        senderType: 'staff',
        senderId: 'dr-martinez',
        senderName: 'Dr. Martinez',
        isRead: true
      }
    ],
    aiResponses: [],
    estimatedResponseTime: 15,
    actualResponseTime: 12,
    satisfactionScore: 4.8
  },
  {
    id: 'case-hist-2',
    patientId: 'p3', // Emma Williams  
    patient: mockPatients[2],
    subject: 'Flu vaccine appointment scheduling',
    summary: 'Patient requested flu vaccination appointment for fall season',
    priority: 'routine',
    status: 'resolved',
    category: 'Vaccination',
    tags: ['flu-vaccine', 'appointment', 'prevention'],
    assignedTo: 'nurse-roberts',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 'msg-hist-2-1',
        content: 'Hello! I would like to schedule my annual flu vaccine. What times do you have available?',
        timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        senderType: 'patient',
        senderId: 'p3',
        senderName: 'Emma Williams',
        isRead: true,
        sentiment: 'positive'
      },
      {
        id: 'msg-hist-2-2',
        content: 'Great to hear you\'re staying up to date with your vaccinations! We have several appointment slots available next week. I can offer you Tuesday at 2:00 PM or Friday at 10:30 AM. The flu vaccine is quick - just about 15 minutes total. Which time works better for you?',
        timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
        senderType: 'staff',
        senderId: 'nurse-roberts',
        senderName: 'Nurse Roberts',
        isRead: true
      }
    ],
    aiResponses: [],
    estimatedResponseTime: 30,
    actualResponseTime: 25,
    satisfactionScore: 5.0
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
