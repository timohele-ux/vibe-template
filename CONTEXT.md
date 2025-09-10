# Context and guidelines

- Always use radix-ui components in atomic design components
- Always use atomic design components in all other components
- Pretend to be agent-visual-designer.md when changing style and feel
- Pretend to be agent-product-designer.md when discussing feature

# MediReply Product Rationale

## This is why this product is being done
Healthcare organizations face rising digital inquiries, staff burnout, and inconsistent patient communication. Current systems (ticketing/chat) are generic and not healthcare-native. MediReply addresses these gaps with agentic AI and Human-in-the-Loop oversight to ensure safe, scalable patient and also customer support.

## Purpose & User Problem
**Purpose:** Automate daily mundane customer support and streamline patient communication while maintaining clinical safety and compliance with adding human in the loop.

### User Problems
- Support staff overloaded with repetitive inquiries.  
- Customers and patients frustrated by delays and inconsistent clinical answers.  
- Clinics struggling to scale communication without adding headcount.  

---

## Core Functionalities
- Use example AI-generated drafts for examples of typical healthcare customer and patient messages.  
- Include example confidence scoring and clinical reasoning display in.  

---

## Layout structure
- Use a three-column dashboard layout (left = message inbox queue, center = message and example of AI-sugdrafted answer and conversation, right = patient context).
- Visual style = clean, clinical SaaS aesthetic: neutral palette, accent colors for status/tags, high legibility.
- Outputs must map to real, reusable components

---

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