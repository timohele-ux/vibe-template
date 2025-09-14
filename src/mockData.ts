export const mockData = {
  patients: [
    {
      patient_id: "P10234",
      name: "Maria S.",
      dob: "1987-03-14",
      contact: {
        phone: "+358-40-123-4567",
        email: "maria.s@example.com",
        preferred_channel: "sms"
      },
      demographics: {
        language: "en",
        timezone: "Europe/Helsinki"
      },
      preferences: {
        reminder_window_hours: 24,
        allow_digital_docs: true,
        needs_plain_language: true
      },
      accessibility: {
        wheelchair_user: false,
        hearing_assistance: false
      },
      insurance: {
        provider: "HealthFirst",
        member_id: "HF-88234"
      },
      support_history: [
        {
          date: "2025-07-01T10:05:00+03:00",
          channel: "sms",
          topic: "Appointment reminder",
          summary: "Confirmed PT appointment for 2025-07-08 10:00.",
          outcome: "confirmed"
        },
        {
          date: "2025-06-15T14:20:00+03:00",
          channel: "web",
          topic: "Parking policy",
          summary: "Viewed clinic parking FAQ.",
          outcome: "self_served"
        }
      ]
    },
    {
      patient_id: "P88342",
      name: "James L.",
      dob: "1992-11-05",
      contact: {
        phone: "+358-50-555-2211",
        email: "james.l@example.com",
        preferred_channel: "email"
      },
      demographics: {
        language: "en",
        timezone: "Europe/Helsinki"
      },
      preferences: {
        reminder_window_hours: 48,
        allow_digital_docs: true,
        needs_plain_language: false
      },
      accessibility: {
        wheelchair_user: false,
        hearing_assistance: false
      },
      insurance: {
        provider: "NordicCare",
        member_id: "NC-44120"
      },
      support_history: [
        {
          date: "2025-06-30T09:45:00+03:00",
          channel: "email",
          topic: "Wayfinding",
          summary: "Shared building map and entry instructions.",
          outcome: "resolved"
        }
      ]
    },
    {
      patient_id: "P33912",
      name: "Sofia K.",
      dob: "1984-02-22",
      contact: {
        phone: "+358-44-229-8877",
        email: "sofia.k@example.com",
        preferred_channel: "portal"
      },
      demographics: {
        language: "en",
        timezone: "Europe/Helsinki"
      },
      preferences: {
        reminder_window_hours: 24,
        allow_digital_docs: true,
        needs_plain_language: false
      },
      accessibility: {
        wheelchair_user: false,
        hearing_assistance: false
      },
      insurance: {
        provider: "HealthFirst",
        member_id: "HF-55291"
      },
      support_history: [
        {
          date: "2025-06-28T16:10:00+03:00",
          channel: "portal",
          topic: "Coverage Q&A",
          summary: "Asked about telehealth copay; directed to plan summary.",
          outcome: "resolved"
        }
      ]
    },
    {
      patient_id: "P44217",
      name: "Alan T.",
      dob: "1979-08-09",
      contact: {
        phone: "+358-41-770-0090",
        email: "alan.t@example.com",
        preferred_channel: "portal"
      },
      demographics: {
        language: "fi",
        timezone: "Europe/Helsinki"
      },
      preferences: {
        reminder_window_hours: 72,
        allow_digital_docs: true,
        needs_plain_language: false
      },
      accessibility: {
        wheelchair_user: false,
        hearing_assistance: false
      },
      insurance: {
        provider: "NordicCare",
        member_id: "NC-77002"
      },
      support_history: [
        {
          date: "2025-06-20T11:30:00+03:00",
          channel: "portal",
          topic: "Profile update",
          summary: "Updated mailing address.",
          outcome: "completed"
        }
      ]
    },
    {
      patient_id: "P76590",
      name: "Rachel B.",
      dob: "1996-01-12",
      contact: {
        phone: "+358-45-300-1122",
        email: "rachel.b@example.com",
        preferred_channel: "sms"
      },
      demographics: {
        language: "en",
        timezone: "Europe/Helsinki"
      },
      preferences: {
        reminder_window_hours: 24,
        allow_digital_docs: true,
        needs_plain_language: true
      },
      accessibility: {
        wheelchair_user: true,
        hearing_assistance: false
      },
      insurance: {
        provider: "HealthFirst",
        member_id: "HF-00318"
      },
      support_history: [
        {
          date: "2025-06-05T13:00:00+03:00",
          channel: "sms",
          topic: "Visitor badge",
          summary: "Explained ID requirements for visitors.",
          outcome: "resolved"
        }
      ]
    },
    {
      patient_id: "P55230",
      name: "David H.",
      dob: "1981-05-30",
      contact: {
        phone: "+358-50-999-6733",
        email: "david.h@example.com",
        preferred_channel: "email"
      },
      demographics: {
        language: "en",
        timezone: "Europe/Helsinki"
      },
      preferences: {
        reminder_window_hours: 24,
        allow_digital_docs: true,
        needs_plain_language: false
      },
      accessibility: {
        wheelchair_user: false,
        hearing_assistance: false
      },
      insurance: {
        provider: "NordicCare",
        member_id: "NC-11881"
      },
      support_history: [
        {
          date: "2025-06-10T10:10:00+03:00",
          channel: "email",
          topic: "Invoice question",
          summary: "Requested line-item explanation; sent PDF.",
          outcome: "resolved"
        }
      ]
    },
    {
      patient_id: "P11028",
      name: "Emma P.",
      dob: "1972-12-03",
      contact: {
        phone: "+358-44-512-4499",
        email: "emma.p@example.com",
        preferred_channel: "phone"
      },
      demographics: {
        language: "fi",
        timezone: "Europe/Helsinki"
      },
      preferences: {
        reminder_window_hours: 48,
        allow_digital_docs: false,
        needs_plain_language: false
      },
      accessibility: {
        wheelchair_user: false,
        hearing_assistance: true
      },
      insurance: {
        provider: "HealthFirst",
        member_id: "HF-88110"
      },
      support_history: [
        {
          date: "2025-06-02T15:20:00+03:00",
          channel: "phone",
          topic: "Accessibility",
          summary: "Confirmed elevator access and assistance policy.",
          outcome: "resolved"
        }
      ]
    }
  ],
  cases: [
    {
      case_id: "C-0001",
      patient_id: "P10234",
      created_at: "2025-07-06T09:00:00+03:00",
      channel: "portal",
      category: "scheduling",
      priority: "routine",
      message: "Hi, I can't make my physical therapy appointment on Tuesday. Can I reschedule for later this week?",
      ai_draft: "Thanks for your message, Maria. We can reschedule your physical therapy appointment. Would Thursday or Friday at 10:00 work for you?",
      ai_recommended_actions: [
        "Offer two alternative slots within 7 days",
        "Update calendar and send confirmation SMS"
      ],
      status: "pending_review",
      sla_minutes: 60,
      tags: ["pt", "reschedule", "nonclinical"]
    },
    {
      case_id: "C-0002",
      patient_id: "P88342",
      created_at: "2025-07-06T09:15:00+03:00",
      channel: "email",
      category: "facility_info",
      priority: "routine",
      message: "Is parking free at your downtown clinic? I have an appointment tomorrow.",
      ai_draft: "Parking is free for the first two hours in our downtown clinic lot. Please bring your parking ticket to the front desk for validation.",
      ai_recommended_actions: ["Attach parking map PDF", "Include validation instructions"],
      status: "pending_review",
      sla_minutes: 120,
      tags: ["parking", "wayfinding", "nonclinical"]
    },
    {
      case_id: "C-0003",
      patient_id: "P33912",
      created_at: "2025-07-06T09:30:00+03:00",
      channel: "portal",
      category: "insurance_billing_info",
      priority: "moderate",
      message: "Does my insurance cover online consultations?",
      ai_draft: "Most plans, including your HealthFirst plan, cover online consultations. We will submit the claim for you, but please confirm final coverage with your insurer.",
      ai_recommended_actions: [
        "Link to plan summary",
        "Offer to connect to billing for detailed copay"
      ],
      status: "pending_review",
      sla_minutes: 180,
      tags: ["billing", "coverage", "nonclinical"]
    },
    {
      case_id: "C-0004",
      patient_id: "P44217",
      created_at: "2025-07-06T09:45:00+03:00",
      channel: "portal",
      category: "profile_update",
      priority: "routine",
      message: "I recently changed my phone number. Can you update it in the system?",
      ai_draft: "Thanks for letting us know, Alan. We've updated your contact number. You will now receive reminders at your new phone.",
      ai_recommended_actions: [
        "Write contact update to CRM",
        "Trigger verification SMS"
      ],
      status: "pending_review",
      sla_minutes: 60,
      tags: ["contact_update", "admin", "nonclinical"]
    },
    {
      case_id: "C-0005",
      patient_id: "P76590",
      created_at: "2025-07-06T10:00:00+03:00",
      channel: "sms",
      category: "general_info",
      priority: "routine",
      message: "What are the visiting hours for the recovery ward?",
      ai_draft: "Visiting hours for the recovery ward are 11:00–19:00 daily. Please bring a valid ID for check-in.",
      ai_recommended_actions: ["Attach visitor policy link"],
      status: "pending_review",
      sla_minutes: 60,
      tags: ["visiting_hours", "policy", "nonclinical"]
    },
    {
      case_id: "C-0006",
      patient_id: "P55230",
      created_at: "2025-07-06T10:15:00+03:00",
      channel: "email",
      category: "billing_admin",
      priority: "moderate",
      message: "Can you send me a copy of my invoice from last month's visit?",
      ai_draft: "We've attached a PDF copy of your invoice from your visit on 2025-06-02. Let us know if you need help with payment options.",
      ai_recommended_actions: [
        "Attach invoice PDF",
        "Offer payment plan link"
      ],
      status: "pending_review",
      sla_minutes: 120,
      tags: ["invoice", "documents", "nonclinical"]
    },
    {
      case_id: "C-0007",
      patient_id: "P11028",
      created_at: "2025-07-06T10:30:00+03:00",
      channel: "phone",
      category: "facility_accessibility",
      priority: "routine",
      message: "Is your west clinic wheelchair accessible?",
      ai_draft: "Yes, our west clinic is fully wheelchair accessible with ramps, elevators, and designated parking spaces.",
      ai_recommended_actions: ["Attach accessibility map", "Offer assistance on arrival"],
      status: "pending_review",
      sla_minutes: 120,
      tags: ["accessibility", "facility_info", "nonclinical"]
    }
  ]
};