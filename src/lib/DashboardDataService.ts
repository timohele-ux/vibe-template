import { useDashboard, dashboardActions } from './DashboardContext';
import { useCallback } from 'react';
import type { Case, Message, AIResponse, Patient } from '../types';
import { healthcareScenarios, createRealisticConversation } from './enhancedMockData';
import { mockCases, mockUsers } from '../mockData';

// Service for managing dashboard data operations
export class DashboardDataService {
  private dispatch: React.Dispatch<any>;

  constructor(dispatch: React.Dispatch<any>) {
    this.dispatch = dispatch;
  }

  // Case Management Operations
  async createNewCase(patientId: string, subject: string, priority: Case['priority'] = 'routine'): Promise<Case> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const patient = mockUsers.find(u => u.id === patientId);
    if (!patient) throw new Error('Patient not found');

    const newCase: Case = {
      id: `case-${Date.now()}`,
      patientId,
      patient: patient as any, // Type conversion for demo
      subject,
      summary: `New patient inquiry: ${subject}`,
      priority,
      status: 'new',
      category: this.categorizeCase(subject),
      tags: this.generateTags(subject),
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      aiResponses: []
    };

    this.dispatch(dashboardActions.addCase(newCase));
    return newCase;
  }

  async updateCaseStatus(caseId: string, status: Case['status'], reason?: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.dispatch(dashboardActions.updateCaseStatus(caseId, status));
    
    // Add notification for status change
    this.dispatch(dashboardActions.addNotification({
      id: `notif-${Date.now()}`,
      type: status === 'escalated' ? 'warning' : status === 'resolved' ? 'success' : 'info',
      title: 'Case Status Updated',
      message: `Case status changed to ${status}${reason ? `. Reason: ${reason}` : ''}`,
      timestamp: new Date(),
      isRead: false,
      caseId
    }));
  }

  async sendMessage(caseId: string, content: string, senderType: 'patient' | 'staff' | 'ai' = 'staff'): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const message: Message = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      senderType,
      senderId: senderType === 'staff' ? 'user-1' : senderType === 'ai' ? 'ai-1' : 'patient-1',
      senderName: senderType === 'staff' ? 'Dr. Johnson' : senderType === 'ai' ? 'AI Assistant' : 'Patient',
      isRead: senderType !== 'patient',
      sentiment: this.analyzeSentiment(content)
    };

    this.dispatch(dashboardActions.sendMessage(caseId, message));
    return message;
  }

  // AI Response Operations
  async generateAIResponse(caseId: string, messageHistory: Message[]): Promise<AIResponse> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lastMessage = messageHistory[messageHistory.length - 1];
    const context = messageHistory.map(m => m.content).join(' ');
    
    // Determine confidence based on message content
    const hasUrgentKeywords = context.toLowerCase().includes('chest pain') || 
                             context.toLowerCase().includes('emergency') ||
                             context.toLowerCase().includes('severe') ||
                             context.toLowerCase().includes('urgent');

    const hasComplexTerms = context.toLowerCase().includes('multiple medications') ||
                           context.toLowerCase().includes('complex') ||
                           context.toLowerCase().includes('confused');

    let confidence: 'high' | 'medium' | 'low';
    let confidenceScore: number;
    let responseContent: string;
    let clinicalReasoning: string;

    if (hasUrgentKeywords) {
      confidence = 'high';
      confidenceScore = 95 + Math.random() * 5;
      responseContent = this.generateUrgentResponse(context);
      clinicalReasoning = 'High confidence emergency response. Critical symptoms identified requiring immediate medical attention.';
    } else if (hasComplexTerms) {
      confidence = 'low';
      confidenceScore = 40 + Math.random() * 20;
      responseContent = this.generateComplexResponse(context);
      clinicalReasoning = 'Low confidence due to complex medical factors requiring clinical judgment.';
    } else {
      confidence = Math.random() > 0.4 ? 'high' : 'medium';
      confidenceScore = confidence === 'high' ? 80 + Math.random() * 15 : 60 + Math.random() * 20;
      responseContent = this.generateStandardResponse(context, lastMessage.content);
      clinicalReasoning = confidence === 'high' 
        ? 'High confidence standard response based on established protocols.'
        : 'Medium confidence response requiring clinical review.';
    }

    const aiResponse: AIResponse = {
      id: `ai-${Date.now()}`,
      caseId,
      content: responseContent,
      confidence,
      confidenceScore: Math.round(confidenceScore),
      clinicalReasoning,
      suggestedActions: this.generateSuggestedActions(confidence, context),
      riskAssessment: {
        level: hasUrgentKeywords ? 'high' : hasComplexTerms ? 'medium' : 'low',
        factors: this.generateRiskFactors(context, hasUrgentKeywords)
      },
      generatedAt: new Date(),
      isApproved: false
    };

    this.dispatch(dashboardActions.addAIResponse(caseId, aiResponse));
    return aiResponse;
  }

  // Utility Methods
  private categorizeCase(subject: string): string {
    const subjectLower = subject.toLowerCase();
    
    if (subjectLower.includes('appointment') || subjectLower.includes('schedule')) return 'Appointments';
    if (subjectLower.includes('prescription') || subjectLower.includes('medication') || subjectLower.includes('refill')) return 'Medication';
    if (subjectLower.includes('lab') || subjectLower.includes('test') || subjectLower.includes('results')) return 'Lab Results';
    if (subjectLower.includes('billing') || subjectLower.includes('insurance') || subjectLower.includes('payment')) return 'Billing';
    if (subjectLower.includes('chest pain') || subjectLower.includes('emergency') || subjectLower.includes('urgent')) return 'Emergency';
    if (subjectLower.includes('follow-up') || subjectLower.includes('followup')) return 'Follow-up';
    
    return 'General';
  }

  private generateTags(subject: string): string[] {
    const tags: string[] = [];
    const subjectLower = subject.toLowerCase();
    
    // Priority tags
    if (subjectLower.includes('urgent') || subjectLower.includes('emergency')) tags.push('urgent');
    if (subjectLower.includes('chest pain')) tags.push('chest-pain');
    if (subjectLower.includes('breathing') || subjectLower.includes('shortness of breath')) tags.push('breathing');
    
    // Category tags
    if (subjectLower.includes('medication') || subjectLower.includes('prescription')) tags.push('medication');
    if (subjectLower.includes('appointment')) tags.push('appointment');
    if (subjectLower.includes('refill')) tags.push('refill');
    if (subjectLower.includes('side effect')) tags.push('side-effects');
    if (subjectLower.includes('lab') || subjectLower.includes('results')) tags.push('lab-results');
    if (subjectLower.includes('follow-up')) tags.push('follow-up');
    
    return tags.length > 0 ? tags : ['general'];
  }

  private analyzeSentiment(content: string): 'positive' | 'neutral' | 'negative' {
    const contentLower = content.toLowerCase();
    
    // Negative indicators
    const negativeWords = ['pain', 'hurt', 'worried', 'concerned', 'emergency', 'urgent', 'severe', 'bad', 'awful', 'terrible'];
    const hasNegative = negativeWords.some(word => contentLower.includes(word));
    
    // Positive indicators
    const positiveWords = ['thank', 'great', 'good', 'excellent', 'pleased', 'satisfied', 'better', 'improved'];
    const hasPositive = positiveWords.some(word => contentLower.includes(word));
    
    if (hasNegative && !hasPositive) return 'negative';
    if (hasPositive && !hasNegative) return 'positive';
    return 'neutral';
  }

  private generateUrgentResponse(context: string): string {
    return `Based on your symptoms, this requires immediate medical attention. Please go to your nearest emergency room immediately or call 911. Do not drive yourself - have someone drive you or call an ambulance.

While waiting for emergency care:
- Try to stay calm and rest in a comfortable position
- Do not take any medications unless prescribed by your doctor
- Have someone stay with you if possible

Your safety is our top priority. Please seek emergency care right away and follow up with us once you've been evaluated.`;
  }

  private generateComplexResponse(context: string): string {
    return `Thank you for your message. Your situation involves multiple medical factors that require careful clinical assessment. I want to ensure you receive the most appropriate care, so I'm connecting you with one of our healthcare providers for a thorough review.

A member of our clinical team will contact you within 2 hours to discuss your concerns and determine the best course of action. In the meantime, please continue taking your medications as prescribed unless otherwise directed.

If you experience any worsening symptoms or have urgent concerns, please don't hesitate to call our office or seek immediate medical attention.`;
  }

  private generateStandardResponse(context: string, lastMessage: string): string {
    const messageLower = lastMessage.toLowerCase();
    
    if (messageLower.includes('appointment')) {
      return `I'd be happy to help you schedule an appointment. Based on your request, I can offer several options:

- Dr. Rodriguez: Available Tuesday at 2:30 PM or Thursday at 10:15 AM
- Dr. Chen: Available Wednesday at 1:00 PM or Friday at 9:30 AM

Each appointment includes adequate time to address your concerns and questions. Would any of these times work for your schedule?

I'll send you a confirmation with preparation instructions once you've selected your preferred appointment time.`;
    }
    
    if (messageLower.includes('medication') || messageLower.includes('prescription')) {
      return `I can help you with your medication concerns. Based on your message, I recommend we:

1. Review your current medication list and dosages
2. Discuss any side effects you're experiencing  
3. Check for any potential interactions
4. Ensure proper administration timing

I can schedule you for a medication review appointment, or if this is urgent, please contact our clinical pharmacist at extension 234. For prescription refills, I can send those to your preferred pharmacy today.

Is there a specific medication concern I can address right away?`;
    }
    
    if (messageLower.includes('results') || messageLower.includes('lab')) {
      return `I understand you have questions about your recent results. Let me help explain what these findings mean:

I've reviewed your results and while some values may seem concerning, it's important to interpret them in the context of your overall health picture. I recommend scheduling a follow-up appointment with your provider to discuss these results in detail.

In the meantime, please continue following your current treatment plan. If you have specific questions about individual test values, I'm happy to provide general information, though clinical interpretation is best done in person.

Would you like me to schedule that follow-up appointment for you?`;
    }
    
    // Generic response
    return `Thank you for reaching out. I've reviewed your message and understand your concerns. Based on the information you've provided, I recommend we schedule you for an appointment to address this properly.

I have several appointment options available:
- This week: Thursday at 3:00 PM or Friday at 11:00 AM  
- Next week: Monday at 9:15 AM or Wednesday at 2:45 PM

During your appointment, we'll have time to thoroughly discuss your concerns and develop an appropriate care plan. Which appointment time would work best for your schedule?`;
  }

  private generateSuggestedActions(confidence: 'high' | 'medium' | 'low', context: string): string[] {
    if (confidence === 'high') {
      if (context.toLowerCase().includes('emergency') || context.toLowerCase().includes('chest pain')) {
        return ['Immediate emergency referral', 'Document emergency response', 'Schedule follow-up post-emergency'];
      }
      return ['Send response to patient', 'Schedule appointment if needed', 'Update patient chart'];
    }
    
    if (confidence === 'medium') {
      return ['Review with clinical staff', 'Consider appointment scheduling', 'Follow established protocols'];
    }
    
    return ['Escalate to healthcare provider', 'Clinical consultation required', 'Hold response pending review'];
  }

  private generateRiskFactors(context: string, hasUrgentKeywords: boolean): string[] {
    if (hasUrgentKeywords) {
      return ['Critical symptoms reported', 'Requires immediate medical attention', 'Potential life-threatening condition'];
    }
    
    const factors: string[] = [];
    const contextLower = context.toLowerCase();
    
    if (contextLower.includes('multiple medications')) factors.push('Complex medication regimen');
    if (contextLower.includes('side effects')) factors.push('Medication adverse effects');
    if (contextLower.includes('chronic')) factors.push('Chronic condition management');
    if (contextLower.includes('elderly') || contextLower.includes('senior')) factors.push('Age-related considerations');
    
    return factors.length > 0 ? factors : ['Standard risk profile', 'Routine care appropriate'];
  }
}

// Custom hook to use the data service
export const useDashboardDataService = () => {
  const { dispatch } = useDashboard();
  
  const dataService = useCallback(() => new DashboardDataService(dispatch), [dispatch]);
  
  return dataService();
};

export default DashboardDataService;
