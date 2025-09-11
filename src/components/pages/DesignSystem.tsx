import React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Caption,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  Select,
  Separator,
  Slider,
  Switch,
  Tabs,
  Text,
  Toggle,
  Tooltip,
  ResponseStateIndicator
} from '../atoms';
import { Card, FormField, PatientMessageCard, AIResponseDraft, SuggestedResources, ResponseActionButtons, KeyboardShortcutsModal } from '../molecules';
import { Form, Header } from '../organisms';
import { mockSuggestedResources } from '../../mockData';
import { useResponseShortcuts } from '../../lib/useKeyboardShortcuts';

const DesignSystem: React.FC = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);
  const [switchChecked, setSwitchChecked] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState([50]);
  const [radioValue, setRadioValue] = React.useState('option1');
  const [selectValue, setSelectValue] = React.useState('');
  const [togglePressed, setTogglePressed] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  // State for Phase 5 demonstrations
  const [currentResponseMode, setCurrentResponseMode] = React.useState<'pending' | 'editing' | 'resolved'>('pending');
  const [showShortcutsModal, setShowShortcutsModal] = React.useState(false);
  const [currentUserRole, setCurrentUserRole] = React.useState<'admin' | 'clinician' | 'support' | 'viewer'>('support');

  // Enhanced keyboard shortcuts integration for demo
  const { getShortcutHelp } = useResponseShortcuts({
    onApprove: currentResponseMode === 'pending' ? () => {
      console.log('Demo: Approve action');
      setCurrentResponseMode('resolved');
    } : undefined,
    onEdit: currentResponseMode === 'pending' ? () => {
      console.log('Demo: Edit action');
      setCurrentResponseMode('editing');
    } : undefined,
    onCancel: currentResponseMode === 'editing' ? () => {
      console.log('Demo: Cancel action');
      setCurrentResponseMode('pending');
    } : undefined,
    onSave: currentResponseMode === 'editing' ? () => {
      console.log('Demo: Save action');
      setCurrentResponseMode('pending');
    } : undefined,
    onShowHelp: () => setShowShortcutsModal(true)
  });

  // Mock data for PatientMessageCard
  const mockPatient = {
    id: 'patient-001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1985-03-15',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    preferredLanguage: 'English',
    communicationPreferences: {
      email: true,
      sms: false,
      phone: true,
      portal: true
    },
    medicalInfo: {
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      medications: ['Metformin', 'Lisinopril'],
      allergies: ['Penicillin'],
      lastVisit: '2024-01-15'
    },
    riskFlags: []
  };

  const mockMessage = {
    id: 'msg-001',
    content: "I have been experiencing some dizziness lately, especially when I stand up quickly. Should I be concerned about this? I am currently taking my medications as prescribed.",
    timestamp: new Date('2024-01-20T10:30:00'),
    senderType: 'patient' as const,
    senderId: 'patient-001',
    senderName: 'Sarah Johnson',
    isRead: true,
    sentiment: 'neutral' as const
  };

  // Mock data for AIResponseDraft
  const mockAIResponse = {
    id: 'ai-001',
    caseId: 'case-001',
    content: `Based on your symptoms of dizziness when standing, this could be related to orthostatic hypotension, which can be a side effect of blood pressure medications like Lisinopril. I recommend:

1. Monitor your blood pressure regularly
2. Rise slowly from sitting or lying positions
3. Stay well hydrated
4. Schedule a follow-up appointment to review your medications

If symptoms worsen or you experience fainting, please contact us immediately.`,
    confidence: 'high' as const,
    confidenceScore: 87,
    clinicalReasoning: 'Patient presents with orthostatic symptoms while on ACE inhibitor therapy. Symptoms are consistent with medication-related orthostatic hypotension.',
    suggestedActions: ['Blood pressure monitoring', 'Medication review', 'Follow-up appointment'],
    riskAssessment: {
      level: 'medium' as const,
      factors: ['Medication side effects', 'Fall risk']
    },
    generatedAt: new Date('2024-01-20T10:35:00'),
    isApproved: false
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Design System</h1>
        
        <Tabs defaultValue="atoms">
          <Tabs.List>
            <Tabs.Trigger value="atoms">Atoms</Tabs.Trigger>
            <Tabs.Trigger value="molecules">Molecules</Tabs.Trigger>
            <Tabs.Trigger value="organisms">Organisms</Tabs.Trigger>
          </Tabs.List>

          {/* Atoms Tab */}
          <Tabs.Content value="atoms">
            <div className="space-y-12">
              {/* Avatar */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Avatar</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex gap-4 items-center">
                    <Avatar src="https://via.placeholder.com/150" alt="User" />
                    <Avatar src="https://via.placeholder.com/150" alt="User" size="lg" />
                    <Avatar fallback="KL" />
                    <Avatar fallback="MM" size="lg" />
                  </div>
                </div>
              </section>

              {/* Badge */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Badge</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex gap-4">
                    <Badge>Default</Badge>
                    <Badge variant="default">Secondary</Badge>
                    <Badge variant="error">Warning</Badge>
                    <Badge variant="info">Outline</Badge>
                  </div>
                </div>
              </section>

              {/* Button */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Button</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex gap-4 flex-wrap">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="danger">Delete</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="ghost">Link</Button>
                    <Button size="sm">Small</Button>
                    <Button size="lg">Large</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </section>

              {/* Checkbox */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Checkbox</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={checkboxChecked}
                      onCheckedChange={(checked) => setCheckboxChecked(checked === true)}
                    />
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                  </div>
                </div>
              </section>

              {/* Input */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Input</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="name@example.com"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="disabled">Disabled</Label>
                      <Input id="disabled" disabled placeholder="Not editable" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Label */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Label</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Label>This is a label for a field</Label>
                </div>
              </section>

              {/* RadioGroup */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">RadioGroup</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                    <div className="flex items-center space-x-2">
                      <RadioGroup.Item value="option1" id="r1" />
                      <Label htmlFor="r1">Option 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroup.Item value="option2" id="r2" />
                      <Label htmlFor="r2">Option 2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroup.Item value="option3" id="r3" />
                      <Label htmlFor="r3">Option 3</Label>
                    </div>
                  </RadioGroup>
                </div>
              </section>

              {/* Select */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="max-w-md">
                    <Label htmlFor="select">Select an option</Label>
                    <Select value={selectValue} onValueChange={setSelectValue}>
                      <Select.Trigger id="select">
                        <Select.Value placeholder="Select..." />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="apple">Apple</Select.Item>
                        <Select.Item value="banana">Banana</Select.Item>
                        <Select.Item value="orange">Orange</Select.Item>
                        <Select.Item value="grape">Grape</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>
                </div>
              </section>

              {/* Separator */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Separator</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="space-y-4">
                    <p>Text before separator</p>
                    <Separator />
                    <p>Text after separator</p>
                    <div className="flex items-center gap-4">
                      <span>Horizontal</span>
                      <Separator orientation="vertical" className="h-6" />
                      <span>Separator</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Slider */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Slider</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="max-w-md space-y-4">
                    <Label>Value: {sliderValue[0]}</Label>
                    <Slider 
                      value={sliderValue} 
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </section>

              {/* Switch */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Switch</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="airplane-mode"
                      checked={switchChecked}
                      onCheckedChange={setSwitchChecked}
                    />
                    <Label htmlFor="airplane-mode">Airplane mode</Label>
                  </div>
                </div>
              </section>

              {/* Tabs */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tabs</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Tabs defaultValue="tab1">
                    <Tabs.List>
                      <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                      <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
                      <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="tab1">
                      <p>Content for tab 1</p>
                    </Tabs.Content>
                    <Tabs.Content value="tab2">
                      <p>Content for tab 2</p>
                    </Tabs.Content>
                    <Tabs.Content value="tab3">
                      <p>Content for tab 3</p>
                    </Tabs.Content>
                  </Tabs>
                </div>
              </section>

              {/* Text */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Text</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                  <Text size="xs">Extra small text (xs)</Text>
                  <Text size="sm">Small text (sm)</Text>
                  <Text>Normal text (base)</Text>
                  <Text size="lg">Large text (lg)</Text>
                  <Text size="xl">Extra large text (xl)</Text>
                  <Text size="2xl">2xl size text</Text>
                  <Text variant="muted">Muted text</Text>
                  <Text variant="danger">Danger text</Text>
                  <Text weight="bold">Bold text</Text>
                </div>
              </section>

              {/* Toggle */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Toggle</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex gap-4">
                    <Toggle 
                      pressed={togglePressed}
                      onPressedChange={setTogglePressed}
                    >
                      {togglePressed ? 'On' : 'Off'}
                    </Toggle>
                    <Toggle variant="outline">Outline</Toggle>
                    <Toggle size="sm">Small</Toggle>
                    <Toggle size="lg">Large</Toggle>
                  </div>
                </div>
              </section>

              {/* ResponseStateIndicator */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">ResponseStateIndicator</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <ResponseStateIndicator state="pending" showLabel={true} />
                      <ResponseStateIndicator state="editing" showLabel={true} />
                      <ResponseStateIndicator state="resolved" showLabel={true} />
                    </div>
                    <div className="flex gap-4 items-center">
                      <ResponseStateIndicator state="pending" size="sm" />
                      <ResponseStateIndicator state="editing" size="md" />
                      <ResponseStateIndicator state="resolved" size="lg" />
                    </div>
                    <div className="flex gap-4 items-center">
                      <ResponseStateIndicator state="pending" animated={false} />
                      <ResponseStateIndicator state="editing" animated={true} />
                      <ResponseStateIndicator state="resolved" animated={true} />
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Phase 3 Features:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>State-Specific Icons:</strong> Clock (pending), edit (editing), checkmark (resolved)</li>
                      <li>• <strong>Animated Indicators:</strong> Pulsing dot for editing, bounce for resolved</li>
                      <li>• <strong>Size Variants:</strong> Small, medium, large for different contexts</li>
                      <li>• <strong>Visual Hierarchy:</strong> Color-coded dots and icons for instant recognition</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Tooltip */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tooltip</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex gap-4">
                    <Tooltip content="This is a tooltip">
                      <Button variant="outline">Hover over me</Button>
                    </Tooltip>
                    <Tooltip content="Another tip" side="bottom">
                      <Button variant="secondary">Below</Button>
                    </Tooltip>
                    <Tooltip content="Third tip" side="right">
                      <Button>On the right</Button>
                    </Tooltip>
                  </div>
                </div>
              </section>
            </div>
          </Tabs.Content>

          {/* Molecules Tab */}
          <Tabs.Content value="molecules">
            <div className="space-y-12">
              {/* Card */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Card</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <h3 className="text-xl font-semibold mb-2">Basic Card</h3>
                      <p className="text-gray-600 mb-4">
                        This is a basic card component that can contain any content.
                      </p>
                      <Button size="sm">Action</Button>
                    </Card>
                    
                    <Card className="border-2 border-blue-500">
                      <h3 className="text-xl font-semibold mb-2">Custom Border Card</h3>
                      <p className="text-gray-600 mb-4">
                        Cards can be customized with different styles and borders.
                      </p>
                      <div className="flex gap-2">
                        <Badge>New</Badge>
                        <Badge variant="info">Featured</Badge>
                      </div>
                    </Card>
                  </div>
                </div>
              </section>

              {/* FormField */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">FormField</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="max-w-md space-y-4">
                    <FormField
                      label="Username"
                      type="text"
                      placeholder="Enter username"
                      required
                    />
                    
                    <FormField
                      label="Email Address"
                      type="email"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                    />
                    
                    <FormField
                      label="Password"
                      type="password"
                      placeholder="Enter password"
                      error="Password must be at least 8 characters"
                    />
                    
                    <FormField
                      label="Disabled Field"
                      type="text"
                      placeholder="Cannot edit"
                      disabled
                    />
                  </div>
                </div>
              </section>

              {/* PatientMessageCard */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">PatientMessageCard</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="max-w-2xl">
                    <PatientMessageCard
                      message={mockMessage}
                      patient={mockPatient}
                    />
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Features:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Displays patient information with avatar and initials</li>
                      <li>• Shows original message content in read-only format</li>
                      <li>• Includes timestamp and message metadata</li>
                      <li>• Preserves message formatting and context</li>
                      <li>• Blue left border indicates patient message type</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* SuggestedResources */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">SuggestedResources</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="max-w-2xl space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Diabetes-Related Resources</h3>
                      <SuggestedResources
                        resources={mockSuggestedResources.filter(r => 
                          r.id === 'res1' || r.id === 'res2' || r.id === 'res4'
                        )}
                        onResourceClick={(resource) => {
                          console.log('Resource clicked:', resource.title);
                          // Mock implementation - would normally open resource
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">General Communication Resources</h3>
                      <SuggestedResources
                        resources={mockSuggestedResources.filter(r => 
                          r.id === 'res3' || r.id === 'res5'
                        )}
                        onResourceClick={(resource) => {
                          console.log('Resource clicked:', resource.title);
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">All Resources</h3>
                      <SuggestedResources
                        resources={mockSuggestedResources}
                        onResourceClick={(resource) => {
                          console.log('Resource clicked:', resource.title);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Features:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Context-aware resource suggestions based on case type and patient conditions</li>
                      <li>• Four resource types: Policy, Procedure, Documentation, External</li>
                      <li>• Type-specific icons and color-coded badges</li>
                      <li>• Optional descriptions with hover effects</li>
                      <li>• External link indicators for resources outside the platform</li>
                      <li>• Clickable resource cards with smooth animations</li>
                      <li>• Resource counter and "View All" functionality</li>
                      <li>• Integrates seamlessly below AI response content</li>
                      <li>• Custom onResourceClick handler for flexible resource handling</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* ResponseActionButtons */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">ResponseActionButtons</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="max-w-3xl space-y-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Response Mode:</label>
                        <select 
                          value={currentResponseMode} 
                          onChange={(e) => setCurrentResponseMode(e.target.value as any)}
                          className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="editing">Editing</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">User Role:</label>
                        <select 
                          value={currentUserRole} 
                          onChange={(e) => setCurrentUserRole(e.target.value as any)}
                          className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                        >
                          <option value="admin">Admin</option>
                          <option value="clinician">Clinician</option>
                          <option value="support">Support</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Standard Actions</h3>
                        <p className="text-sm text-gray-600">Role: {currentUserRole}, Mode: {currentResponseMode}</p>
                      </div>
                      
                      <ResponseActionButtons
                        responseMode={currentResponseMode}
                        userRole={currentUserRole}
                        isLoading={false}
                        canApprove={currentUserRole === 'admin' || currentUserRole === 'clinician'}
                        canEscalate={true}
                        isClinicalCase={false}
                        hasValidation={true}
                        onApprove={() => {
                          console.log('Demo: Approve action');
                          setCurrentResponseMode('resolved');
                        }}
                        onSaveDraft={() => {
                          console.log('Demo: Save draft');
                          setCurrentResponseMode('pending');
                        }}
                        onEdit={() => {
                          console.log('Demo: Edit action');
                          setCurrentResponseMode('editing');
                        }}
                        onEscalate={() => console.log('Demo: Escalate action')}
                        onForwardSupervisor={() => console.log('Demo: Forward to supervisor')}
                        onRequestReview={() => console.log('Demo: Request clinical review')}
                        onShowShortcuts={() => setShowShortcutsModal(true)}
                      />
                    </div>

                    <div className="bg-white rounded-lg border border-red-200 p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-red-900 mb-2">Clinical Case Example</h3>
                        <p className="text-sm text-red-600">High-priority clinical case requiring review</p>
                      </div>
                      
                      <ResponseActionButtons
                        responseMode="pending"
                        userRole="support"
                        isLoading={false}
                        canApprove={false}
                        canEscalate={true}
                        isClinicalCase={true}
                        hasValidation={true}
                        onApprove={() => console.log('Demo: Approve action')}
                        onSaveDraft={() => console.log('Demo: Save draft')}
                        onEdit={() => console.log('Demo: Edit action')}
                        onEscalate={() => console.log('Demo: Escalate action')}
                        onForwardSupervisor={() => console.log('Demo: Forward to supervisor')}
                        onRequestReview={() => console.log('Demo: Request clinical review')}
                        onShowShortcuts={() => setShowShortcutsModal(true)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Phase 5 Features:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Role-Based Actions:</strong> Different button sets based on user permissions</li>
                      <li>• <strong>Context-Aware Buttons:</strong> Clinical cases show required review actions</li>
                      <li>• <strong>Comprehensive Keyboard Shortcuts:</strong> Ctrl+Enter (approve), Ctrl+E (edit), Escape (cancel)</li>
                      <li>• <strong>Action Hierarchy:</strong> Primary, secondary, and escalation action grouping</li>
                      <li>• <strong>State-Responsive UI:</strong> Buttons adapt to pending/editing/resolved modes</li>
                      <li>• <strong>Visual Feedback:</strong> Icons, tooltips, and animation states for all actions</li>
                      <li>• <strong>Workflow Management:</strong> Forward to supervisor and clinical review options</li>
                      <li>• <strong>Help Integration:</strong> Built-in keyboard shortcuts reference (Ctrl+/)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* KeyboardShortcutsModal Demo */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">KeyboardShortcutsModal</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="max-w-2xl">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Keyboard Shortcuts Help System</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Click the button below to see the keyboard shortcuts modal in action. 
                        The modal shows context-aware shortcuts based on the current response state.
                      </p>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowShortcutsModal(true)}
                        className="state-transition"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Show Keyboard Shortcuts
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Features:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Context-Aware Shortcuts:</strong> Shows only relevant shortcuts for current state</li>
                      <li>• <strong>Categorized Display:</strong> Groups shortcuts by primary, secondary, navigation, and utility</li>
                      <li>• <strong>Visual Key Representation:</strong> Keyboard-style key displays with proper formatting</li>
                      <li>• <strong>Responsive Modal:</strong> Clean, accessible modal design with escape key support</li>
                      <li>• <strong>Category Badges:</strong> Color-coded badges for different shortcut categories</li>
                      <li>• <strong>Help Integration:</strong> Accessible via Ctrl+/ from anywhere in the system</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* AIResponseDraft */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">AIResponseDraft</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="max-w-3xl">
                    <AIResponseDraft
                      aiResponse={mockAIResponse}
                      onApprove={(id, modifications) => console.log('Approved:', id, modifications)}
                      onReject={(id, reason) => console.log('Rejected:', id, reason)}
                      onEdit={(id, content, editReason, customReason) => console.log('Edited:', id, content, editReason, customReason)}
                      suggestedResources={mockSuggestedResources.slice(0, 3)}
                      onResourceClick={(resource) => console.log('Resource clicked:', resource.title)}
                      userRole="support"
                      canApprove={true}
                      canEscalate={true}
                      isClinicalCase={false}
                      onForwardSupervisor={() => console.log('Demo: Forward to supervisor')}
                      onRequestReview={() => console.log('Demo: Request clinical review')}
                    />
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Phase 2, 3, 4 & 5 Features:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>State Management:</strong> Pending → Editing → Resolved workflow</li>
                      <li>• <strong>Edit Reason Tracking:</strong> Mandatory reason selection for audit compliance</li>
                      <li>• <strong>Visual State System:</strong> Color-coded backgrounds with state glow effects</li>
                      <li>• <strong>State Animations:</strong> Fade-in, slide-in, and bounce transitions</li>
                      <li>• <strong>Response State Indicators:</strong> Animated dots with state-specific icons</li>
                      <li>• <strong>Enhanced Visual Feedback:</strong> Pulse effects, glow states, and smooth transitions</li>
                      <li>• <strong>Suggested Resources Integration:</strong> Context-aware resource suggestions below response content</li>
                      <li>• <strong>Enhanced Action Button System:</strong> Role-based actions with comprehensive keyboard shortcuts</li>
                      <li>• <strong>Keyboard Shortcut System:</strong> Global shortcuts with context-aware help modal (Ctrl+/)</li>
                      <li>• <strong>Keyboard Shortcuts:</strong> Ctrl+E (edit), Ctrl+Enter (approve), Esc (cancel)</li>
                      <li>• <strong>Audit Trail Ready:</strong> Captures edit reasons and custom explanations</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Phase 6: Workflow State Management Demo */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Phase 6: Workflow State Management</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="max-w-4xl">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Centralized Conversation State & Audit Trail</h3>
                      
                      {/* Workflow Status Demo */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Current State</h4>
                          <Badge variant="info" className="mb-2">pending</Badge>
                          <p className="text-sm text-blue-700">Response awaiting review or approval</p>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-medium text-yellow-900 mb-2">Workflow Flags</h4>
                          <div className="space-y-1">
                            <Badge variant="warning" size="sm">Clinical Review</Badge>
                            <Badge variant="default" size="sm">3 Edits</Badge>
                          </div>
                          <p className="text-sm text-yellow-700 mt-2">Active workflow monitoring</p>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">Audit Trail</h4>
                          <div className="text-sm text-green-700">
                            <p>✓ Edit reasons tracked</p>
                            <p>✓ User actions logged</p>
                            <p>✓ Compliance ready</p>
                          </div>
                        </div>
                      </div>

                      {/* Simulated Edit History */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Sample Edit History</h4>
                        <div className="space-y-2">
                          <div className="bg-white rounded-lg p-3 text-sm border">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="info" size="sm">content-correction</Badge>
                              <Caption variant="muted">2 minutes ago</Caption>
                            </div>
                            <Caption className="text-gray-600">Corrected medical terminology for accuracy</Caption>
                            <Caption variant="muted">User: clinician_01 • Content: 245 chars</Caption>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 text-sm border">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="default" size="sm">tone-adjustment</Badge>
                              <Caption variant="muted">15 minutes ago</Caption>
                            </div>
                            <Caption className="text-gray-600">Made response more empathetic</Caption>
                            <Caption variant="muted">User: support_02 • Content: 198 chars</Caption>
                          </div>
                        </div>
                      </div>

                      {/* Workflow Validation Demo */}
                      <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                        <h4 className="font-medium text-orange-900 mb-2">Workflow Validation</h4>
                        <div className="text-sm space-y-1">
                          <p className="text-orange-700">
                            <strong>Validation Check:</strong> Clinical case requires clinician approval before resolution
                          </p>
                          <p className="text-orange-700">
                            <strong>Auto-Escalation:</strong> 3+ edits trigger supervisor notification
                          </p>
                          <p className="text-orange-700">
                            <strong>Compliance:</strong> All edit reasons documented for audit trail
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Phase 6 Features:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Centralized State Management:</strong> ConversationStateProvider for unified state</li>
                      <li>• <strong>Workflow State Tracking:</strong> Transition validation and business rule enforcement</li>
                      <li>• <strong>Comprehensive Audit Trail:</strong> Complete edit history with reasons and timestamps</li>
                      <li>• <strong>Auto-Escalation Logic:</strong> Automatic escalation based on edit count and case priority</li>
                      <li>• <strong>Clinical Safety Checks:</strong> Required clinical review for medical cases</li>
                      <li>• <strong>Compliance Ready:</strong> Audit trail export and compliance reporting</li>
                      <li>• <strong>State Persistence:</strong> Conversation state saved to localStorage</li>
                      <li>• <strong>Role-Based Validation:</strong> Workflow transitions based on user permissions</li>
                      <li>• <strong>Real-time Status Indicators:</strong> Visual workflow status in case header</li>
                      <li>• <strong>Edit Pattern Analysis:</strong> Risk factor detection and warnings</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </Tabs.Content>

          {/* Organisms Tab */}
          <Tabs.Content value="organisms">
            <div className="space-y-12">
              {/* Header */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Header</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <Header title="Sample Header" subtitle="This is a sample header component" />
                </div>
              </section>

              {/* Form */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Form</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form 
                      title="Contact Form"
                      onSubmit={handleFormSubmit}
                      submitText="Send Message"
                    >
                      <FormField
                        label="Full Name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        placeholder="John Doe"
                        required
                      />
                      <FormField
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        placeholder="john@example.com"
                        required
                      />
                      <FormField
                        label="Message"
                        type="text"
                        value={formData.message}
                        onChange={handleInputChange('message')}
                        placeholder="Your message here..."
                      />
                    </Form>

                    <Form 
                      title="Login Form"
                      onSubmit={handleFormSubmit}
                      submitText="Sign In"
                      cancelText="Back"
                      onCancel={() => console.log('Cancel clicked')}
                    >
                      <FormField
                        label="Email"
                        type="email"
                        placeholder="user@example.com"
                        required
                      />
                      <FormField
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        required
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                      </div>
                    </Form>
                  </div>
                </div>
              </section>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>
      
      {/* Global Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
        shortcuts={getShortcutHelp()}
        title="AI Response Management Shortcuts"
      />
    </div>
  );
};

export default DesignSystem;