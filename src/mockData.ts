import type { Case, Patient, Message, DashboardMetrics, User } from './types';

// Enhanced Mock Patients with complex medical histories
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
      conditions: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
      medications: ['Metformin 1000mg twice daily', 'Lisinopril 10mg daily', 'Atorvastatin 20mg at bedtime'],
      allergies: ['Penicillin (rash)', 'Sulfa drugs (hives)'],
      lastVisit: '2024-08-15'
    },
    riskFlags: ['Multiple medications', 'Diabetes complications', 'Cardiovascular risk']
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
      conditions: ['Asthma', 'Exercise-Induced Bronchospasm', 'Seasonal Allergies'],
      medications: ['Albuterol MDI 2 puffs as needed', 'Fluticasone 110mcg twice daily', 'Cetirizine 10mg daily'],
      allergies: ['Tree pollen', 'Cat dander', 'Dust mites'],
      lastVisit: '2024-09-01'
    },
    riskFlags: ['Severe asthma exacerbations', 'Emergency department visits']
  },
  {
    id: 'p3',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    dateOfBirth: '1992-07-08',
    email: 'emma.rodriguez@email.com',
    phone: '+1-555-0125',
    insuranceId: 'INS123458',
    preferredLanguage: 'es',
    communicationPreferences: {
      email: true,
      sms: true,
      phone: true,
      portal: false
    },
    medicalInfo: {
      conditions: ['Migraine Headaches', 'Anxiety Disorder', 'Iron Deficiency Anemia'],
      medications: ['Sumatriptan 50mg as needed', 'Sertraline 50mg daily', 'Iron Sulfate 325mg twice daily'],
      allergies: ['Shellfish (anaphylaxis)', 'NSAIDs (stomach upset)'],
      lastVisit: '2024-08-30'
    },
    riskFlags: ['Frequent migraines affecting work', 'Anxiety management']
  },
  {
    id: 'p4',
    firstName: 'Robert',
    lastName: 'Thompson',
    dateOfBirth: '1955-01-12',
    email: 'robert.thompson@email.com',
    phone: '+1-555-0126',
    insuranceId: 'MEDICARE-789',
    preferredLanguage: 'en',
    communicationPreferences: {
      email: false,
      sms: false,
      phone: true,
      portal: true
    },
    medicalInfo: {
      conditions: ['Chronic Heart Failure', 'Atrial Fibrillation', 'Chronic Kidney Disease Stage 3', 'COPD'],
      medications: ['Metoprolol 100mg twice daily', 'Warfarin 5mg daily', 'Furosemide 40mg daily', 'Albuterol nebulizer'],
      allergies: ['Penicillin (anaphylaxis)', 'ACE inhibitors (angioedema)'],
      lastVisit: '2024-08-28'
    },
    riskFlags: ['Multiple comorbidities', 'Anticoagulation therapy', 'Fall risk', 'Frequent hospitalizations']
  },
  {
    id: 'p5',
    firstName: 'Lisa',
    lastName: 'Wang',
    dateOfBirth: '1990-05-20',
    email: 'lisa.wang@email.com',
    phone: '+1-555-0127',
    insuranceId: 'BCBS-456',
    preferredLanguage: 'en',
    communicationPreferences: {
      email: true,
      sms: true,
      phone: false,
      portal: true
    },
    medicalInfo: {
      conditions: ['Hypothyroidism', 'PCOS', 'Vitamin D Deficiency'],
      medications: ['Levothyroxine 100mcg daily', 'Metformin 500mg twice daily', 'Vitamin D3 2000 IU daily'],
      allergies: ['Latex (contact dermatitis)'],
      lastVisit: '2024-09-05'
    },
    riskFlags: ['Endocrine disorders', 'Fertility concerns']
  }
];

// Enhanced Messages with realistic healthcare communication patterns
const createHealthcareMessages = (patientName: string, caseId: string, scenario: string): Message[] => {
  const baseTime = Date.now() - 4 * 60 * 60 * 1000; // 4 hours ago
  
  switch (scenario) {
    case 'medication-question':
      return [
        {
          id: `msg-${caseId}-1`,
          content: `Hi, I have a question about my blood pressure medication. I've been taking Lisinopril for about 2 weeks now and I'm experiencing a persistent dry cough. I've read this could be a side effect. Should I be concerned? Should I stop taking it?`,
          timestamp: new Date(baseTime),
          senderType: 'patient',
          senderId: 'p1',
          senderName: patientName,
          isRead: true,
          sentiment: 'neutral'
        },
        {
          id: `msg-${caseId}-2`,
          content: `Thank you for reaching out about your medication side effects. A dry cough is indeed a known side effect of ACE inhibitors like Lisinopril, occurring in about 10-15% of patients. This typically appears within the first few weeks of starting the medication.

I recommend you do not stop the medication abruptly. Instead, let's schedule you for an appointment this week so we can evaluate your blood pressure control and discuss alternative medications if needed. In the meantime, please continue taking the Lisinopril as prescribed.

We can consider switching to an ARB (like Losartan) which typically doesn't cause the cough side effect.`,
          timestamp: new Date(baseTime + 20 * 60 * 1000), // 20 mins later
          senderType: 'ai',
          senderId: 'ai-1',
          senderName: 'AI Assistant',
          isRead: true,
          sentiment: 'positive'
        }
      ];
      
    case 'urgent-appointment':
      return [
        {
          id: `msg-${caseId}-1`,
          content: `I need to be seen urgently. I've been having chest pain on and off for the past 3 hours. It's a sharp pain that comes and goes, and I'm also feeling short of breath. My heart rate feels irregular. I have a history of heart problems. Should I go to the ER or can I be seen at the clinic today?`,
          timestamp: new Date(baseTime),
          senderType: 'patient',
          senderId: 'p4',
          senderName: patientName,
          isRead: true,
          sentiment: 'negative'
        },
        {
          id: `msg-${caseId}-2`,
          content: `This requires immediate medical attention. Given your symptoms of chest pain, shortness of breath, and irregular heart rate, combined with your cardiac history, you should go to the emergency room immediately.

Please do not drive yourself - call 911 or have someone drive you to the nearest emergency room. These symptoms need urgent evaluation and cannot wait for a clinic appointment.

I'm also notifying Dr. Johnson about this message so she's aware of your situation.`,
          timestamp: new Date(baseTime + 3 * 60 * 1000), // 3 mins later
          senderType: 'staff',
          senderId: 'dr-johnson',
          senderName: 'Dr. Sarah Johnson',
          isRead: true,
          sentiment: 'negative'
        }
      ];
      
    case 'prescription-refill':
      return [
        {
          id: `msg-${caseId}-1`,
          content: `Hi, I need a refill on my asthma medications. My Fluticasone inhaler is almost empty and I have about 3 days left of my Albuterol. Can you please send refills to CVS Pharmacy on Main Street? My insurance recently changed so please make sure the new information is on file.`,
          timestamp: new Date(baseTime),
          senderType: 'patient',
          senderId: 'p2',
          senderName: patientName,
          isRead: true,
          sentiment: 'neutral'
        },
        {
          id: `msg-${caseId}-2`,
          content: `I can help you with those prescription refills. I've checked your file and see that you're due for refills on both medications.

I've sent the prescriptions to CVS on Main Street:
- Fluticasone 110mcg inhaler - 1 inhaler with 2 refills
- Albuterol MDI - 1 inhaler with 5 refills

Regarding your insurance, I'll need you to provide the updated information. You can either:
1. Upload a photo of your new insurance card through the patient portal
2. Call our office at (555) 123-4567
3. Bring the card to your next appointment

The prescriptions should be ready for pickup within 2 hours. Is there anything else I can help you with regarding your asthma management?`,
          timestamp: new Date(baseTime + 15 * 60 * 1000), // 15 mins later
          senderType: 'ai',
          senderId: 'ai-1',
          senderName: 'AI Assistant',
          isRead: true,
          sentiment: 'positive'
        }
      ];
      
    case 'lab-results-question':
      return [
        {
          id: `msg-${caseId}-1`,
          content: `I received a message that my lab results are available in the portal. I looked at them but I don't understand what they mean. My cholesterol numbers seem high and there's something about my liver enzymes being elevated. Should I be worried? Do I need to change my medications?`,
          timestamp: new Date(baseTime),
          senderType: 'patient',
          senderId: 'p1',
          senderName: patientName,
          isRead: true,
          sentiment: 'negative'
        },
        {
          id: `msg-${caseId}-2`,
          content: `I understand your concerns about your lab results. Let me help explain what these findings mean:

**Cholesterol levels**: Your LDL (bad cholesterol) is elevated at 165 mg/dL (goal is <100 for someone with diabetes). This suggests we may need to adjust your current statin dose or consider additional therapy.

**Liver enzymes**: The mild elevation in your ALT could be related to your statin medication or your diabetes management. This needs clinical evaluation.

I'm scheduling you for an appointment with Dr. Johnson within the next week to review these results in detail and discuss any necessary medication adjustments. Please continue taking all your current medications as prescribed until you speak with the doctor.

In the meantime, continue following your diabetic diet and exercise routine. Do you have any specific questions about these results?`,
          timestamp: new Date(baseTime + 25 * 60 * 1000), // 25 mins later
          senderType: 'ai',
          senderId: 'ai-1',
          senderName: 'AI Assistant',
          isRead: true,
          sentiment: 'neutral'
        }
      ];
      
    default:
      return [
        {
          id: `msg-${caseId}-1`,
          content: `I have a general question about my health and would like to schedule an appointment when convenient.`,
          timestamp: new Date(baseTime),
          senderType: 'patient',
          senderId: 'p3',
          senderName: patientName,
          isRead: false,
          sentiment: 'neutral'
        }
      ];
  }
};

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
    messages: createHealthcareMessages('Sarah Johnson', 'case-1', 'urgent-appointment'),
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
    messages: createHealthcareMessages('Michael Chen', 'case-2', 'prescription-refill'),
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
    messages: createHealthcareMessages('Emma Rodriguez', 'case-3', 'default'),
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
    messages: createHealthcareMessages('Sarah Johnson', 'case-4', 'medication-question'),
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
    messages: createHealthcareMessages('Michael Chen', 'case-5', 'lab-results-question'),
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

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user-2',
    firstName: 'Dr. Michael',
    lastName: 'Rodriguez',
    email: 'dr.rodriguez@medireply.com',
    role: 'clinician',
    department: 'Cardiology',
    isOnline: true,
    lastActive: new Date(Date.now() - 300000), // 5 minutes ago
    permissions: {
      canApproveAI: true,
      canEscalate: true,
      canViewAllCases: true,
      canModifySettings: false
    },
    preferences: {
      notifications: true,
      soundAlerts: false,
      autoAssign: true
    }
  },
  {
    id: 'user-3',
    firstName: 'Lisa',
    lastName: 'Chen',
    email: 'l.chen@medireply.com',
    role: 'support',
    department: 'Patient Support',
    isOnline: false,
    lastActive: new Date(Date.now() - 3600000), // 1 hour ago
    permissions: {
      canApproveAI: false,
      canEscalate: true,
      canViewAllCases: false,
      canModifySettings: false
    },
    preferences: {
      notifications: true,
      soundAlerts: true,
      autoAssign: true
    }
  },
  {
    id: 'user-4',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@medireply.com',
    role: 'admin',
    department: 'IT',
    isOnline: true,
    lastActive: new Date(Date.now() - 60000), // 1 minute ago
    permissions: {
      canApproveAI: true,
      canEscalate: true,
      canViewAllCases: true,
      canModifySettings: true
    },
    preferences: {
      notifications: false,
      soundAlerts: false,
      autoAssign: false
    }
  }
];
