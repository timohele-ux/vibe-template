Create a .md file from this functionality description:

# Middle Panel Features: Customer Question & AI Drafted Answer

## Overview

The middle panel serves as the primary workspace where healthcare support agents review patient queries and manage AI-generated responses before sending them to patients. This section is critical for maintaining quality control and compliance in patient communications.

---

## **Patient Message Section**

### **Purpose**

Displays the original patient query in a dedicated, clearly labeled section to provide context for the agent's response.

### **Operational Behavior**

- **Static Display**: Shows the patient's original message in read-only format
- **Visual Hierarchy**: Uses a card layout with User icon and "Patient Message" header
- **Context Preservation**: Maintains the original query text exactly as submitted by the patient

### **User Interactions**

- **No Direct Interaction**: This section is informational only
- **Reference Point**: Agents use this to understand the patient's concern before crafting responses

### **Workflow Contribution**

- **Context Setting**: Ensures agents have full visibility of the patient's original concern
- **Quality Assurance**: Prevents misunderstandings by preserving the exact patient query
- **Audit Trail**: Maintains record of original patient communication

---

## **AI Response Management System**

### **Dynamic Response Display**

#### **Purpose**

Presents AI-generated responses in different states based on conversation status and editing mode.

#### **Operational Behavior**

- **Pending State**: Shows editable AI-drafted response in gray background
- **Editing State**: Transforms into blue-highlighted editing interface
- **Resolved State**: Displays final sent response in green success styling

#### **User Interactions**

- **View Mode**: Agents can read the AI-generated response
- **Edit Trigger**: Click "Edit Response" button or use Ctrl+E shortcut
- **State Transitions**: Interface adapts based on conversation status

---

### **Edit Response Functionality**

#### **Purpose**

Allows agents to modify AI-generated responses while maintaining audit compliance through reason tracking.

#### **Operational Behavior**

- **Inline Editing**: Transforms display into editable textarea
- **Mandatory Reasoning**: Requires selection of edit reason before saving
- **Visual Distinction**: Blue background indicates editing mode
- **Validation**: Blocks actions until edit reason is provided

#### **User Interactions**

- **Activation**: Click "Edit Response" button or Ctrl+E
- **Text Modification**: Direct editing in textarea
- **Reason Selection**: Dropdown with predefined options:

- Correction (content error)
- Tone adjustment
- Adding/removing personal info
- Policy clarification
- Other (with custom text field)

- **Save/Cancel**: Dedicated buttons for action completion

#### **Workflow Contribution**

- **Quality Control**: Ensures human oversight of AI responses
- **Compliance**: Tracks all modifications for audit purposes
- **Flexibility**: Allows customization while maintaining accountability

---

### **Edit Reason Tracking System**

#### **Purpose**

Maintains comprehensive audit trail of all response modifications for compliance and quality improvement.

#### **Operational Behavior**

- **Mandatory Selection**: Prevents saving without reason selection
- **Predefined Categories**: Standardized reasons for consistency
- **Custom Options**: "Other" category with free-text input
- **Persistent Storage**: Reasons saved with archived conversations

#### **User Interactions**

- **Dropdown Selection**: Choose from predefined edit reasons
- **Custom Input**: Text field appears when "Other" is selected
- **Validation Feedback**: System prevents progression without selection

#### **Workflow Contribution**

- **Audit Compliance**: Meets healthcare documentation requirements
- **Quality Analytics**: Enables analysis of common edit patterns
- **Training Data**: Provides insights for AI model improvement

---

## **Response State Management**

### **Draft State (Active Conversations)**

#### **Purpose**

Manages responses for conversations still in the queue requiring agent action.

#### **Operational Behavior**

- **Editable Interface**: Full editing capabilities available
- **Action Buttons**: Approve/Send, Save Draft, Forward options
- **Real-time Updates**: Changes reflected immediately in interface

#### **User Interactions**

- **Edit Mode**: Toggle between view and edit states
- **Action Selection**: Multiple workflow options available
- **Keyboard Shortcuts**: Ctrl+E for edit, Ctrl+Enter for approve

---

### **Final State (Archived Conversations)**

#### **Purpose**

Displays completed responses that have been sent to patients, maintaining read-only historical record.

#### **Operational Behavior**

- **Read-only Display**: No editing capabilities
- **Success Styling**: Green background indicates completion
- **Audit Information**: Shows edit reasons and timestamps
- **Historical Context**: Preserves final response exactly as sent

#### **User Interactions**

- **View Only**: No modification capabilities
- **Reference Access**: Can review past responses for consistency

#### **Workflow Contribution**

- **Historical Record**: Maintains complete communication history
- **Quality Review**: Enables supervisors to review completed interactions
- **Learning Resource**: Provides examples for training and consistency

---

## **Suggested Resources Integration**

### **Purpose**

Provides contextually relevant resources (documents, links, policies) based on detected intent to enhance response quality.

### **Operational Behavior**

- **Intent-Based Display**: Resources appear based on conversation categorization
- **Visual Integration**: Appears below response text in dedicated section
- **External Links**: Provides access to relevant documentation

### **User Interactions**

- **Resource Access**: Click external link icon to open resources
- **Reference Integration**: Agents can incorporate resource information into responses

### **Workflow Contribution**

- **Response Enhancement**: Provides additional context for comprehensive answers
- **Consistency**: Ensures agents have access to current policies and procedures
- **Efficiency**: Reduces time spent searching for relevant information

---

## **Action Button System**

### **Standard Workflow Actions**

#### **Approve & Send**

- **Purpose**: Finalizes and sends response to patient
- **Behavior**: Moves conversation from Queue to Archive
- **Validation**: Requires edit reason if response was modified
- **Shortcut**: Ctrl+Enter

#### **Save Draft**

- **Purpose**: Preserves work without sending
- **Behavior**: Maintains conversation in queue with saved changes
- **Use Case**: Allows agents to pause work and return later

#### **Forward to Supervisor**

- **Purpose**: Escalates complex queries requiring management review
- **Behavior**: Flags conversation for supervisor attention
- **Workflow**: Maintains conversation in queue with escalation flag

### **Clinical Escalation Actions**

#### **Escalate to Clinical Team**

- **Purpose**: Routes medical queries to qualified clinical staff
- **Behavior**: Automatically disables standard send options
- **Safety Feature**: Prevents non-clinical staff from providing medical advice
- **Compliance**: Ensures proper handling of clinical inquiries

---

## **Keyboard Shortcuts Integration**

### **Purpose**

Accelerates agent workflow through keyboard-based navigation and actions.

### **Available Shortcuts**

- **Ctrl+E**: Enter edit mode
- **Ctrl+Enter**: Approve and send response
- **Escape**: Cancel current edit
- **Ctrl+/**: Display shortcuts help

### **Workflow Contribution**

- **Efficiency**: Reduces mouse dependency for common actions
- **Speed**: Enables rapid response processing
- **Accessibility**: Supports keyboard-only navigation

---

## **Visual Feedback System**

### **State Indicators**

- **Color Coding**: Different backgrounds for different states (gray=draft, blue=editing, green=final)
- **Icons**: Visual cues for different response states
- **Badges**: Status indicators for resolved conversations

### **Transition Animations**

- **Smooth Changes**: Animated transitions between states
- **Loading States**: Visual feedback during processing
- **Success Indicators**: Confirmation of completed actions

---

## **Overall Workflow Contribution**

The middle panel serves as the **quality control hub** where:

1. **Human Oversight** ensures AI responses meet healthcare communication standards
2. **Audit Compliance** tracks all modifications for regulatory requirements
3. **Workflow Efficiency** streamlines the review-edit-approve process
4. **Safety Measures** prevent inappropriate responses through validation and escalation
5. **Knowledge Integration** provides contextual resources for comprehensive responses
6. **Historical Tracking** maintains complete records for quality improvement and training