import type { Case, Patient, Message, AIResponse, User } from '../types';

// Enhanced healthcare scenarios with realistic patient inquiries and AI responses

export const healthcareScenarios = {
  // Appointment-related scenarios
  appointment: {
    urgent: [
      "I need to schedule an urgent appointment. I've been having chest pain for the past hour.",
      "My child has a high fever (103°F) and won't stop crying. Can we get seen today?",
      "I think I may have broken my wrist after a fall this morning. What should I do?",
      "I'm experiencing severe abdominal pain. Should I go to the ER or can you see me?"
    ],
    routine: [
      "I'd like to schedule my annual physical exam when you have availability.",
      "Can I get my flu shot? I'd prefer to come in next week if possible.",
      "I need to schedule a follow-up for my blood pressure check.",
      "Could you help me reschedule my appointment from Tuesday to Wednesday?"
    ]
  },

  // Medication-related scenarios  
  medication: {
    sideEffects: [
      "I started taking the new blood pressure medication and I'm feeling dizzy. Is this normal?",
      "The antibiotic you prescribed is causing stomach upset. Should I stop taking it?",
      "I've been on this pain medication for a week and it's not helping much. What are my options?",
      "I'm experiencing headaches since starting the new diabetes medication."
    ],
    refills: [
      "I need a refill on my insulin prescription. I have about 3 days left.",
      "Can you send a refill for my heart medication to my pharmacy?",
      "My asthma inhaler is almost empty. Can I get a new prescription?",
      "I lost my medication during travel. Can you help me get a replacement?"
    ],
    questions: [
      "Should I take my medication with food or on an empty stomach?",
      "I forgot to take my morning dose. Should I take it now or skip it?",
      "Can I take my prescription with over-the-counter pain relievers?",
      "When should I expect to see improvements from this new medication?"
    ]
  },

  // Test results and lab work
  labResults: [
    "I received a message that my lab results are ready. Can someone explain what they mean?",
    "My cholesterol levels seem high according to my results. What's the next step?",
    "The blood work shows some abnormal values. Should I be concerned?",
    "I need to schedule follow-up labs. When should I come in?"
  ],

  // Insurance and billing
  billing: [
    "I received a bill that seems incorrect. Can someone help me understand the charges?",
    "My insurance has changed. How do I update my information?",
    "I need a prior authorization for my specialist referral. What's the process?",
    "Can you provide an estimate for my upcoming procedure?"
  ],

  // General health concerns
  symptoms: [
    "I've been having persistent headaches for the past week. Should I be worried?",
    "I noticed some unusual changes in my vision. When should I be seen?",
    "I've been more tired than usual lately. Could this be related to my diabetes?",
    "I have a rash that appeared yesterday and it's spreading. What should I do?"
  ]
};

// AI Response templates with varying confidence levels
export const aiResponseTemplates = {
  high: {
    appointment: {
      urgent: "Based on your symptoms, this requires immediate medical attention. I've flagged this as urgent and you should be seen within 2 hours. I'm checking for the earliest available appointment slot.",
      routine: "I can help you schedule that appointment. Based on your medical history, I recommend scheduling within the next 2-3 weeks. Let me check our availability."
    },
    medication: {
      sideEffect: "These symptoms can be a common side effect of [medication]. However, given your medical history, I recommend we discuss this with your provider. Continue the medication but monitor closely.",
      refill: "I can see you're due for a refill. I've sent the prescription to your preferred pharmacy. You should be able to pick it up within 2 hours."
    }
  },
  medium: {
    general: "Based on your symptoms and medical history, this appears to be [condition]. I recommend scheduling an appointment within 1-2 weeks for proper evaluation.",
    followup: "This requires follow-up care. I suggest we schedule you for next week to monitor your progress and adjust treatment if needed."
  },
  low: {
    uncertain: "I'd like to have one of our medical professionals review your case. This falls outside my confidence range for providing specific medical advice.",
    complex: "Your situation involves multiple factors that require clinical judgment. Let me connect you with a healthcare provider for proper assessment."
  }
};

// Medical terminology and clinical reasoning examples
export const clinicalReasoningExamples = [
  "Patient presents with classic symptoms consistent with [condition]. Risk factors include [factors]. Recommended immediate evaluation based on symptom severity.",
  "Medication interaction analysis shows no contraindications with current prescriptions. Standard monitoring protocol applies.",
  "Symptoms align with known side effects of current medication regimen. Risk-benefit analysis suggests continuing treatment with increased monitoring.",
  "Patient's medical history includes [conditions] which may complicate treatment. Specialist consultation recommended for optimal care coordination.",
  "Lab values indicate [finding] which requires prompt attention. Clinical correlation with symptoms supports urgent care referral.",
  "Based on age, medical history, and presenting symptoms, differential diagnosis includes [conditions]. Further evaluation needed for definitive diagnosis."
];

// Enhanced patient profiles with complex medical histories
export const extendedPatientProfiles: Patient[] = [
  {
    id: 'p1-extended',
    firstName: 'Margaret',
    lastName: 'Thompson',
    dateOfBirth: '1945-12-03',
    email: 'margaret.thompson@email.com',
    phone: '+1-555-0201',
    insuranceId: 'MEDICARE-789123',
    preferredLanguage: 'en',
    communicationPreferences: {
      email: false,
      sms: false,
      phone: true,
      portal: true
    },
    medicalInfo: {
      conditions: [
        'Congestive Heart Failure', 
        'Type 2 Diabetes Mellitus', 
        'Chronic Kidney Disease Stage 3',
        'Hypertension',
        'Atrial Fibrillation',
        'Osteoarthritis'
      ],
      medications: [
        'Metformin 1000mg twice daily',
        'Lisinopril 20mg daily',
        'Metoprolol 50mg twice daily',
        'Warfarin 5mg daily',
        'Furosemide 40mg daily',
        'Insulin Glargine 25 units at bedtime'
      ],
      allergies: ['Penicillin (rash)', 'Sulfa drugs (hives)', 'Shellfish (anaphylaxis)'],
      lastVisit: '2024-09-01'
    },
    riskFlags: [
      'Multiple chronic conditions',
      'High fall risk',
      'Medication complexity',
      'Anticoagulation therapy',
      'Frequent hospitalizations'
    ]
  },
  {
    id: 'p2-extended',
    firstName: 'James',
    lastName: 'Rodriguez',
    dateOfBirth: '1995-08-14',
    email: 'james.rodriguez@email.com',
    phone: '+1-555-0202',
    insuranceId: 'BCBS-456789',
    preferredLanguage: 'es',
    communicationPreferences: {
      email: true,
      sms: true,
      phone: true,
      portal: false
    },
    medicalInfo: {
      conditions: ['Asthma', 'Seasonal Allergies', 'Exercise-Induced Bronchospasm'],
      medications: [
        'Albuterol MDI 2 puffs as needed',
        'Fluticasone 220mcg twice daily',
        'Montelukast 10mg at bedtime',
        'Cetirizine 10mg daily'
      ],
      allergies: ['Tree pollen', 'Cat dander'],
      lastVisit: '2024-08-20'
    },
    riskFlags: ['Severe asthma exacerbations', 'Emergency department visits']
  },
  {
    id: 'p3-extended',
    firstName: 'Priya',
    lastName: 'Patel',
    dateOfBirth: '1988-04-22',
    email: 'priya.patel@email.com',
    phone: '+1-555-0203',
    insuranceId: 'AETNA-321654',
    preferredLanguage: 'en',
    communicationPreferences: {
      email: true,
      sms: true,
      phone: false,
      portal: true
    },
    medicalInfo: {
      conditions: ['Hypothyroidism', 'Iron Deficiency Anemia', 'Migraine Headaches'],
      medications: [
        'Levothyroxine 100mcg daily',
        'Iron Sulfate 325mg twice daily',
        'Sumatriptan 50mg as needed for migraines'
      ],
      allergies: ['NSAIDS (stomach upset)'],
      lastVisit: '2024-08-25'
    },
    riskFlags: ['Medication adherence concerns', 'Frequent migraines affecting work']
  }
];

// Workflow examples for different case types
export const workflowExamples = {
  routine: {
    steps: [
      'Initial patient inquiry received',
      'AI generates response with high confidence',
      'Staff reviews and approves AI response',
      'Response sent to patient',
      'Follow-up scheduled if needed'
    ],
    averageTime: '15 minutes',
    staffInvolvement: 'Minimal - Review and approve'
  },
  
  urgent: {
    steps: [
      'Urgent case flagged automatically',
      'Immediate staff notification',
      'Clinical review within 30 minutes',
      'Direct patient contact initiated',
      'Appointment scheduled or emergency referral'
    ],
    averageTime: '45 minutes',
    staffInvolvement: 'High - Direct clinical involvement'
  },
  
  escalated: {
    steps: [
      'AI confidence below threshold',
      'Case escalated to clinical staff',
      'Provider reviews patient history',
      'Personalized response crafted',
      'Patient contacted directly'
    ],
    averageTime: '2 hours',
    staffInvolvement: 'High - Full clinical assessment'
  }
};

// Realistic message chains for different scenarios
export const createRealisticConversation = (scenario: string, patientName: string): Message[] => {
  const baseTime = Date.now() - 4 * 60 * 60 * 1000; // 4 hours ago
  
  switch (scenario) {
    case 'medication-side-effects':
      return [
        {
          id: `msg-${Date.now()}-1`,
          content: "I started the new blood pressure medication you prescribed last week, and I've been feeling dizzy and lightheaded, especially when I stand up. Is this normal? Should I be concerned?",
          timestamp: new Date(baseTime),
          senderType: 'patient',
          senderId: 'patient-1',
          senderName: patientName,
          isRead: true,
          sentiment: 'neutral'
        },
        {
          id: `msg-${Date.now()}-2`,
          content: "Thank you for reaching out about your medication side effects. Dizziness and lightheadedness can be common when starting blood pressure medications, especially when standing up quickly (orthostatic hypotension). This often improves as your body adjusts to the medication over 1-2 weeks.",
          timestamp: new Date(baseTime + 30 * 60 * 1000), // 30 mins later
          senderType: 'ai',
          senderId: 'ai-assistant',
          senderName: 'AI Assistant',
          isRead: true,
          sentiment: 'positive'
        },
        {
          id: `msg-${Date.now()}-3`,
          content: "Should I continue taking it? The dizziness is making it hard to work safely.",
          timestamp: new Date(baseTime + 45 * 60 * 1000), // 45 mins later
          senderType: 'patient',
          senderId: 'patient-1',
          senderName: patientName,
          isRead: true,
          sentiment: 'negative'
        }
      ];
      
    case 'appointment-urgent':
      return [
        {
          id: `msg-${Date.now()}-1`,
          content: "I've been having severe chest pain for the past 2 hours. It comes and goes but it's really concerning me. I also feel short of breath. Should I go to the ER or can I be seen at the clinic today?",
          timestamp: new Date(baseTime),
          senderType: 'patient',
          senderId: 'patient-2',
          senderName: patientName,
          isRead: true,
          sentiment: 'negative'
        },
        {
          id: `msg-${Date.now()}-2`,
          content: "This requires immediate medical attention. Chest pain with shortness of breath needs urgent evaluation. Please go to the nearest emergency room immediately or call 911. Do not drive yourself - have someone drive you or call for emergency transport.",
          timestamp: new Date(baseTime + 2 * 60 * 1000), // 2 mins later
          senderType: 'staff',
          senderId: 'dr-johnson',
          senderName: 'Dr. Sarah Johnson',
          isRead: true,
          sentiment: 'neutral'
        }
      ];
      
    default:
      return [];
  }
};

export default {
  healthcareScenarios,
  aiResponseTemplates,
  clinicalReasoningExamples,
  extendedPatientProfiles,
  workflowExamples,
  createRealisticConversation
};
