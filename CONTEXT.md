# Context and guidelines

- Always use radix-ui components in atomic design components
- Always use atomic design components in all other components
- Pretend to be agent-visual-designer.md when changing style and feel
- Pretend to be agent-product-designer.md when discussing feature

# Layout structure

# Features
- The solution provides a complete healthcare support workflow with AI assistance, proper escalation handling, and comprehensive patient data management while maintaining clear separation between different work states.

**1. Tab-Based Ticket Management**
- Three-tab workflow: Inbox (new cases), Active (in-progress), Archive (resolved)
- Status-based filtering and organization
- Visual indicators for ticket priority and escalation status

**2. Healthcare-Focused Case Data**
- Comprehensive patient profiles with demographics, insurance, and accessibility needs
- Healthcare-specific case categories (scheduling, billing, facility info, accessibility)
- Realistic mock data with 6 patients and 6 support cases

**3. AI-Powered Response Generation**
- Unique AI draft responses tailored to each case type
- Context-aware suggestions based on patient information and case category
- AI-recommended actions with visual indicators (paperclip icons for attachments)

**4. Expert Escalation System**
- Escalate complex cases to specialists (Technical Lead, Billing Specialist, Product Manager, Security Expert)
- Automatic customer notifications when cases are escalated
- Visual "Escalated" badges and "Waiting for Expert Response" status messages
- Prevention of further edits on escalated cases

**5. Complete Conversation History**
- Full chronological message threading for all cases regardless of status
- Clear visual distinction between customer (blue) and support (green) messages
- Persistent conversation context across status changes

**6. Customer Details Management**
- Slide-out drawer with comprehensive patient information
- Healthcare-specific data including insurance, accessibility needs, and communication preferences
- Support history and notes tracking

**7. Status Workflow Management**
- Automated status transitions: new → in-progress → resolved
- Context-aware action buttons based on current tab and ticket status
- Success messages guiding agents to next actions
- Read-only mode for archived cases

**8. Search and Filtering**
- Real-time search across ticket content
- Priority-based visual indicators (low/medium/high)
- Category-based organization


## File listing

```
├── dist/
│   ├── assets/
│   │   └── index-DuW8b0PD.css
│   └── index.html
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── RadioGroup.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Separator.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Text.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── index.ts
│   │   ├── molecules/
│   │   │   ├── Card.tsx
│   │   │   ├── FormField.tsx
│   │   │   └── index.ts
│   │   ├── organisms/
│   │   │   ├── Form.tsx
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   ├── DesignSystem.tsx
│   │   │   └── index.ts
│   │   └── templates/
│   │       ├── PageTemplate.tsx
│   │       └── index.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── agent-product-designer.md
├── agent-visual-designer.md
├── CLAUDE.md
├── CONTEXT.md
├── index.html
├── package-lock.json
├── package.json
├── style-prompt.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```