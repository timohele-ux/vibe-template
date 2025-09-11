import { useCallback, useMemo } from 'react';
import { useConversationState } from './ConversationStateContext';
import type { Case, AIResponse, Message, UserRole } from '../types';

// Clinical keywords and patterns for intent detection
const CLINICAL_KEYWORDS = {
  urgent: [
    'emergency', 'urgent', 'severe', 'critical', 'immediate', 'acute', 
    'chest pain', 'difficulty breathing', 'unconscious', 'bleeding', 
    'heart attack', 'stroke', 'allergic reaction', 'overdose'
  ],
  medical: [
    'diagnosis', 'symptoms', 'treatment', 'medication', 'prescription', 
    'side effects', 'dosage', 'medical advice', 'pain', 'fever', 
    'infection', 'blood pressure', 'diabetes', 'cancer', 'surgery'
  ],
  mentalHealth: [
    'depression', 'anxiety', 'suicide', 'self-harm', 'mental health', 
    'therapy', 'counseling', 'psychiatric', 'bipolar', 'panic attack',
    'substance abuse', 'addiction', 'suicidal thoughts'
  ],
  pregnancy: [
    'pregnant', 'pregnancy', 'prenatal', 'maternity', 'fetal', 
    'trimester', 'delivery', 'labor', 'contractions', 'miscarriage'
  ],
  pediatric: [
    'child', 'children', 'pediatric', 'infant', 'baby', 'toddler', 
    'vaccination', 'immunization', 'development', 'growth'
  ]
};

export interface ClinicalIntentAnalysis {
  isClinical: boolean;
  isUrgent: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedCategories: string[];
  confidence: number;
  requiresEscalation: boolean;
  suggestedActions: string[];
  escalationReason: string;
}

export interface ClinicalSafetyFlags {
  blockSending: boolean;
  requiresClinicalReview: boolean;
  requiresSupervisorApproval: boolean;
  autoEscalate: boolean;
  warningMessage: string;
}

export const useClinicalIntentDetection = () => {
  const { state } = useConversationState();

  // Analyze text for clinical content and risk
  const analyzeContent = useCallback((content: string): ClinicalIntentAnalysis => {
    const lowerContent = content.toLowerCase();
    const detectedCategories: string[] = [];
    let totalMatches = 0;
    let urgentMatches = 0;

    // Check each category for matches
    Object.entries(CLINICAL_KEYWORDS).forEach(([category, keywords]) => {
      const matches = keywords.filter(keyword => lowerContent.includes(keyword));
      if (matches.length > 0) {
        detectedCategories.push(category);
        totalMatches += matches.length;
        if (category === 'urgent') {
          urgentMatches += matches.length;
        }
      }
    });

    // Calculate confidence based on keyword density
    const wordCount = content.split(/\s+/).length;
    const confidence = Math.min(totalMatches / wordCount * 10, 1);

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (urgentMatches > 0) {
      riskLevel = 'critical';
    } else if (detectedCategories.includes('mentalHealth') && lowerContent.includes('suicide')) {
      riskLevel = 'critical';
    } else if (detectedCategories.length >= 3 || totalMatches >= 5) {
      riskLevel = 'high';
    } else if (detectedCategories.length >= 2 || totalMatches >= 3) {
      riskLevel = 'medium';
    }

    const isClinical = detectedCategories.length > 0;
    const isUrgent = urgentMatches > 0 || riskLevel === 'critical';
    
    // Determine escalation requirements
    const requiresEscalation = riskLevel === 'critical' || 
                              (riskLevel === 'high' && detectedCategories.includes('mentalHealth'));

    // Generate suggested actions
    const suggestedActions: string[] = [];
    if (isUrgent) {
      suggestedActions.push('Immediate clinical review required');
      suggestedActions.push('Consider emergency protocols');
    }
    if (detectedCategories.includes('mentalHealth')) {
      suggestedActions.push('Mental health specialist consultation');
    }
    if (detectedCategories.includes('pregnancy')) {
      suggestedActions.push('OB/GYN specialist review');
    }
    if (detectedCategories.includes('pediatric')) {
      suggestedActions.push('Pediatric specialist review');
    }

    const escalationReason = isUrgent ? 
      'Urgent medical content detected requiring immediate attention' :
      `Clinical content detected: ${detectedCategories.join(', ')}`;

    return {
      isClinical,
      isUrgent,
      riskLevel,
      detectedCategories,
      confidence,
      requiresEscalation,
      suggestedActions,
      escalationReason
    };
  }, []);

  // Analyze messages for clinical content
  const analyzeMessages = useCallback((messages: Message[]): ClinicalIntentAnalysis => {
    const combinedContent = messages.map(m => m.content).join(' ');
    return analyzeContent(combinedContent);
  }, [analyzeContent]);

  // Analyze AI response for clinical appropriateness
  const analyzeAIResponse = useCallback((response: AIResponse, originalMessages: Message[]): ClinicalIntentAnalysis => {
    const messageAnalysis = analyzeMessages(originalMessages);
    const responseAnalysis = analyzeContent(response.content);

    // Combine analyses with weighted importance on original messages
    const combinedAnalysis: ClinicalIntentAnalysis = {
      isClinical: messageAnalysis.isClinical || responseAnalysis.isClinical,
      isUrgent: messageAnalysis.isUrgent || responseAnalysis.isUrgent,
      riskLevel: messageAnalysis.riskLevel === 'critical' || responseAnalysis.riskLevel === 'critical' ? 'critical' :
                messageAnalysis.riskLevel === 'high' || responseAnalysis.riskLevel === 'high' ? 'high' :
                messageAnalysis.riskLevel === 'medium' || responseAnalysis.riskLevel === 'medium' ? 'medium' : 'low',
      detectedCategories: [...new Set([...messageAnalysis.detectedCategories, ...responseAnalysis.detectedCategories])],
      confidence: Math.max(messageAnalysis.confidence, responseAnalysis.confidence),
      requiresEscalation: messageAnalysis.requiresEscalation || responseAnalysis.requiresEscalation,
      suggestedActions: [...new Set([...messageAnalysis.suggestedActions, ...responseAnalysis.suggestedActions])],
      escalationReason: messageAnalysis.isUrgent ? messageAnalysis.escalationReason : responseAnalysis.escalationReason
    };

    return combinedAnalysis;
  }, [analyzeContent, analyzeMessages]);

  // Generate clinical safety flags based on user role and content analysis
  const generateSafetyFlags = useCallback((
    analysis: ClinicalIntentAnalysis, 
    userRole: UserRole,
    hasBeenReviewed: boolean = false
  ): ClinicalSafetyFlags => {
    const isNonClinicalUser = !['admin', 'clinician'].includes(userRole);
    
    let blockSending = false;
    let requiresClinicalReview = false;
    let requiresSupervisorApproval = false;
    let autoEscalate = false;
    let warningMessage = '';

    if (analysis.isClinical) {
      // Clinical content always requires review by non-clinical users
      if (isNonClinicalUser && !hasBeenReviewed) {
        blockSending = true;
        requiresClinicalReview = true;
        warningMessage = 'Clinical content detected. Clinician review required before sending.';
      }

      // High risk content requires supervisor approval
      if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
        requiresSupervisorApproval = true;
        if (analysis.riskLevel === 'critical') {
          autoEscalate = true;
          warningMessage = 'Critical medical content detected. Automatic escalation initiated.';
        } else {
          warningMessage = 'High-risk medical content. Supervisor approval required.';
        }
      }

      // Mental health emergencies require immediate escalation
      if (analysis.detectedCategories.includes('mentalHealth') && analysis.isUrgent) {
        autoEscalate = true;
        blockSending = true;
        warningMessage = 'Mental health emergency detected. Immediate escalation required.';
      }
    }

    return {
      blockSending,
      requiresClinicalReview,
      requiresSupervisorApproval,
      autoEscalate,
      warningMessage
    };
  }, []);

  // Analyze current active case
  const currentCaseAnalysis = useMemo((): ClinicalIntentAnalysis | null => {
    if (!state.activeConversation) return null;
    return analyzeMessages(state.activeConversation.messages);
  }, [state.activeConversation, analyzeMessages]);

  // Get safety recommendations for current case
  const getCurrentSafetyFlags = useCallback((userRole: UserRole): ClinicalSafetyFlags | null => {
    if (!currentCaseAnalysis) return null;
    return generateSafetyFlags(
      currentCaseAnalysis, 
      userRole, 
      state.workflowFlags.requiresClinicalReview && !!state.workflowFlags.clinicalReviewerId
    );
  }, [currentCaseAnalysis, generateSafetyFlags, state.workflowFlags]);

  // Check if response should be blocked
  const shouldBlockResponse = useCallback((
    aiResponse: AIResponse, 
    userRole: UserRole
  ): { blocked: boolean; reason: string } => {
    if (!state.activeConversation) return { blocked: false, reason: '' };

    const analysis = analyzeAIResponse(aiResponse, state.activeConversation.messages);
    const safetyFlags = generateSafetyFlags(analysis, userRole);

    return {
      blocked: safetyFlags.blockSending,
      reason: safetyFlags.warningMessage
    };
  }, [state.activeConversation, analyzeAIResponse, generateSafetyFlags]);

  return {
    // Analysis functions
    analyzeContent,
    analyzeMessages,
    analyzeAIResponse,
    generateSafetyFlags,
    
    // Current case data
    currentCaseAnalysis,
    getCurrentSafetyFlags,
    
    // Validation functions
    shouldBlockResponse,
    
    // Computed properties
    isClinicalCase: currentCaseAnalysis?.isClinical || false,
    isUrgentCase: currentCaseAnalysis?.isUrgent || false,
    riskLevel: currentCaseAnalysis?.riskLevel || 'low'
  };
};

export default useClinicalIntentDetection;
