// Mock WebSocket service for real-time updates in MediReply dashboard
import type { Case, Message, AIResponse, User } from '../types';

interface WebSocketEvent {
  type: 'case_update' | 'new_message' | 'ai_response' | 'user_status' | 'notification';
  data: any;
  timestamp: Date;
}

interface WebSocketCallbacks {
  onCaseUpdate?: (case_: Case) => void;
  onNewMessage?: (caseId: string, message: Message) => void;
  onAIResponse?: (caseId: string, response: AIResponse) => void;
  onUserStatusChange?: (user: User) => void;
  onNotification?: (notification: any) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

class MockWebSocketService {
  private isConnected = false;
  private callbacks: WebSocketCallbacks = {};
  private eventQueue: WebSocketEvent[] = [];
  private intervalId: number | null = null;
  private connectionCheckInterval: number | null = null;
  
  constructor() {
    this.simulateConnection();
  }

  // Simulate WebSocket connection
  private simulateConnection() {
    // Simulate connection delay
    setTimeout(() => {
      this.isConnected = true;
      this.callbacks.onConnectionChange?.(true);
      
      // Start generating mock events
      this.startEventGeneration();
      
      // Simulate occasional disconnections
      this.simulateConnectionInterruptions();
    }, 1000);
  }

  // Start generating mock real-time events
  private startEventGeneration() {
    this.intervalId = setInterval(() => {
      this.generateMockEvent();
    }, 8000); // Generate event every 8 seconds
  }

  // Simulate connection interruptions
  private simulateConnectionInterruptions() {
    this.connectionCheckInterval = setInterval(() => {
      // 5% chance of connection interruption
      if (Math.random() < 0.05) {
        this.simulateDisconnection();
      }
    }, 30000); // Check every 30 seconds
  }

  private simulateDisconnection() {
    if (!this.isConnected) return;

    this.isConnected = false;
    this.callbacks.onConnectionChange?.(false);

    // Simulate reconnection after 2-5 seconds
    const reconnectDelay = Math.random() * 3000 + 2000;
    setTimeout(() => {
      this.isConnected = true;
      this.callbacks.onConnectionChange?.(true);
      
      // Process queued events after reconnection
      this.processEventQueue();
    }, reconnectDelay);
  }

  private processEventQueue() {
    this.eventQueue.forEach(event => this.handleEvent(event));
    this.eventQueue = [];
  }

  private generateMockEvent() {
    if (!this.isConnected) {
      // Queue events while disconnected
      const event = this.createRandomEvent();
      this.eventQueue.push(event);
      return;
    }

    const event = this.createRandomEvent();
    this.handleEvent(event);
  }

  private createRandomEvent(): WebSocketEvent {
    const eventTypes = ['new_message', 'ai_response', 'user_status', 'notification'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)] as WebSocketEvent['type'];

    switch (randomType) {
      case 'new_message':
        return {
          type: 'new_message',
          data: {
            caseId: `case-${Math.floor(Math.random() * 5) + 1}`,
            message: {
              id: `msg-${Date.now()}-${Math.random()}`,
              content: this.getRandomPatientMessage(),
              timestamp: new Date(),
              senderType: 'patient',
              senderId: `patient-${Math.floor(Math.random() * 3) + 1}`,
              senderName: this.getRandomPatientName(),
              isRead: false,
              sentiment: Math.random() > 0.7 ? 'negative' : Math.random() > 0.5 ? 'neutral' : 'positive'
            }
          },
          timestamp: new Date()
        };

      case 'ai_response':
        return {
          type: 'ai_response',
          data: {
            caseId: `case-${Math.floor(Math.random() * 5) + 1}`,
            response: {
              id: `ai-${Date.now()}-${Math.random()}`,
              caseId: `case-${Math.floor(Math.random() * 5) + 1}`,
              content: this.getRandomAIResponse(),
              confidence: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
              confidenceScore: Math.floor(Math.random() * 40) + 60, // 60-100
              clinicalReasoning: "Automated analysis based on patient inquiry and medical history.",
              suggestedActions: ["Review patient history", "Schedule follow-up if needed"],
              riskAssessment: {
                level: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
                factors: ["Standard risk assessment"]
              },
              generatedAt: new Date(),
              isApproved: false
            }
          },
          timestamp: new Date()
        };

      case 'user_status':
        return {
          type: 'user_status',
          data: {
            userId: `user-${Math.floor(Math.random() * 4) + 1}`,
            isOnline: Math.random() > 0.3,
            lastActive: new Date()
          },
          timestamp: new Date()
        };

      case 'notification':
        return {
          type: 'notification',
          data: {
            id: `notif-${Date.now()}`,
            type: Math.random() > 0.8 ? 'urgent' : Math.random() > 0.6 ? 'warning' : 'info',
            title: this.getRandomNotificationTitle(),
            message: this.getRandomNotificationMessage(),
            timestamp: new Date(),
            isRead: false
          },
          timestamp: new Date()
        };

      default:
        return {
          type: 'notification',
          data: { message: 'Unknown event' },
          timestamp: new Date()
        };
    }
  }

  private handleEvent(event: WebSocketEvent) {
    switch (event.type) {
      case 'new_message':
        this.callbacks.onNewMessage?.(event.data.caseId, event.data.message);
        break;
      case 'ai_response':
        this.callbacks.onAIResponse?.(event.data.caseId, event.data.response);
        break;
      case 'user_status':
        this.callbacks.onUserStatusChange?.(event.data);
        break;
      case 'notification':
        this.callbacks.onNotification?.(event.data);
        break;
    }
  }

  // Random content generators
  private getRandomPatientMessage(): string {
    const messages = [
      "I'm experiencing some discomfort after taking my medication. Should I be concerned?",
      "Could you help me reschedule my appointment for next week?",
      "I have some questions about my recent test results.",
      "Is it normal to feel dizzy after starting the new medication?",
      "I need to update my insurance information for my upcoming visit.",
      "Can someone explain what these lab results mean?",
      "I'm having trouble accessing my patient portal account.",
      "When should I expect to hear back about my referral?",
      "I think I may have missed a dose - what should I do?",
      "Could you clarify the instructions for my pre-procedure prep?"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getRandomPatientName(): string {
    const names = ["Sarah Johnson", "Michael Chen", "Emma Rodriguez", "David Kim", "Lisa Wang"];
    return names[Math.floor(Math.random() * names.length)];
  }

  private getRandomAIResponse(): string {
    const responses = [
      "Based on your symptoms, I recommend scheduling a follow-up appointment within the next week.",
      "Your test results appear normal. Please continue with your current medication regimen.",
      "I can help you reschedule your appointment. Let me check available times for next week.",
      "These side effects are generally mild. Please monitor and contact us if they worsen.",
      "I've updated your insurance information. Your coverage should be active for your next visit.",
      "Your lab results show improvement. Please maintain your current treatment plan."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getRandomNotificationTitle(): string {
    const titles = [
      "New Critical Case",
      "AI Response Ready",
      "System Update",
      "Appointment Reminder",
      "Lab Results Available",
      "Staff Member Online"
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private getRandomNotificationMessage(): string {
    const messages = [
      "Critical patient case requires immediate attention",
      "AI has generated a response with high confidence",
      "System maintenance scheduled for tonight",
      "Patient appointment reminder sent",
      "New lab results available for review",
      "Dr. Rodriguez has come online"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Public methods
  subscribe(callbacks: WebSocketCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  unsubscribe(): void {
    this.callbacks = {};
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }
  }

  isConnectionActive(): boolean {
    return this.isConnected;
  }

  // Mock method to send data (in real implementation this would send to server)
  send(data: any): void {
    if (!this.isConnected) {
      console.warn('WebSocket not connected. Message queued.');
      return;
    }
    console.log('Mock WebSocket sending:', data);
  }

  // Force reconnection (for testing)
  forceReconnect(): void {
    this.simulateDisconnection();
  }
}

// Singleton instance
export const webSocketService = new MockWebSocketService();

export default MockWebSocketService;
