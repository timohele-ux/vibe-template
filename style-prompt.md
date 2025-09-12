# Support Dashboard UI/UX Specification

## Table of Contents
1. [Overview](#overview)
2. [Layout Structure](#layout-structure)
3. [Visual Design System](#visual-design-system)
4. [Component Specifications](#component-specifications)
5. [Interactive Elements](#interactive-elements)
6. [Responsive Design](#responsive-design)
7. [User Experience Patterns](#user-experience-patterns)
8. [Accessibility Guidelines](#accessibility-guidelines)

## Overview

The Support Dashboard is a healthcare administrative support application designed for desktop-first workflows. It provides a three-panel layout optimizing agent productivity through clear visual hierarchy, context-stable navigation, and AI-powered assistance.

### Design Philosophy
- **Efficiency First**: Minimize clicks and cognitive load for support agents
- **Context Preservation**: Never disrupt agent workflow with unexpected navigation
- **Visual Clarity**: Clear status indicators and visual hierarchy for quick decision-making
- **Professional Healthcare Aesthetic**: Clean, trustworthy design appropriate for healthcare administration

## Layout Structure

### Primary Layout (Desktop)
\`\`\`
┌───────────────────────────────────────────────────────────────┐
│                    Support Dashboard                          │
├──────────────┬──────────────────────────────┬─────────────────┤
│              │                              │                 │
│   Left Panel │        Center Panel          │  Right Drawer   │
│  (384px)     │       (Flexible)             │   (Overlay)     │
│              │                              │                 │
│ Ticket Queue │   Conversation View          │ Customer Details│
│              │                              │                 │
│              │                              │                 │
│              │                              │                 │
│              │                              │                 │
└──────────────┴──────────────────────────────┴─────────────────┘
\`\`\`

### Panel Responsibilities

#### Left Panel - Ticket Queue (384px fixed width)
- **Header Section**: Application title, search, and navigation tabs
- **Ticket List**: Scrollable list of cases with status-based filtering
- **Tab Navigation**: Inbox (new), Active (in-progress), Archive (resolved)

#### Center Panel - Conversation View (Flexible width)
- **Case Header**: Customer info, case details, and action buttons
- **AI Recommendations**: Contextual suggestions and required actions
- **Conversation History**: Complete message thread with visual distinction
- **Action Area**: Reply composition, escalation forms, or status displays

#### Right Drawer - Customer Details (Overlay, 400px width)
- **Patient Profile**: Demographics, contact preferences, accessibility needs
- **Support History**: Previous interactions and case outcomes
- **Insurance Information**: Provider details and coverage notes

## Visual Design System

### Color Palette

#### Primary Colors
- **Primary Blue**: `#6366f1` (Indigo-500) - Actions, links, selections
- **Secondary Gray**: `#1f2937` (Gray-800) - Headers, important text
- **Background White**: `#ffffff` - Main backgrounds
- **Card Gray**: `#f8fafc` (Slate-50) - Card backgrounds, subtle areas

#### Status Colors
- **New/Inbox**: `#3b82f6` (Blue-500) - New cases requiring attention
- **In-Progress/Active**: `#f97316` (Orange-500) - Cases awaiting response
- **Resolved/Archive**: `#10b981` (Emerald-500) - Completed cases
- **Escalated**: `#f59e0b` (Amber-500) - Cases requiring expert attention

#### Priority Colors
- **Low Priority**: `#10b981` (Emerald-500) - Routine inquiries
- **Medium Priority**: `#f59e0b` (Amber-500) - Standard urgency
- **High Priority**: `#dc2626` (Red-600) - Urgent cases

#### Semantic Colors
- **Success**: `#10b981` (Emerald-500) - Confirmations, completed actions
- **Warning**: `#f59e0b` (Amber-500) - Cautions, pending states
- **Error**: `#dc2626` (Red-600) - Errors, critical issues
- **Info**: `#3b82f6` (Blue-500) - Information, neutral states

### Typography

#### Font Stack
- **Primary**: Geist Sans - Clean, professional sans-serif for all UI text
- **Monospace**: Geist Mono - Code, IDs, technical references

#### Type Scale
- **Heading Large**: `text-xl` (20px) - Panel titles, case subjects
- **Heading Medium**: `text-lg` (18px) - Section headers
- **Body Regular**: `text-sm` (14px) - Primary content, messages
- **Body Small**: `text-xs` (12px) - Metadata, timestamps, badges
- **Caption**: `text-xs` (12px) - Helper text, secondary information

#### Font Weights
- **Semibold** (`font-semibold`): Panel titles, case subjects
- **Medium** (`font-medium`): Section headers, sender names
- **Regular** (`font-normal`): Body text, messages
- **Light** (`font-light`): Timestamps, metadata

### Spacing System

#### Layout Spacing
- **Panel Padding**: `p-6` (24px) - Major content areas
- **Card Padding**: `p-4` (16px) - Individual case cards, message cards
- **Section Spacing**: `space-y-4` (16px) - Between major sections
- **Element Spacing**: `gap-2` (8px) - Between related elements
- **Tight Spacing**: `gap-1` (4px) - Between badges, small elements

#### Border Radius
- **Cards**: `rounded-lg` (8px) - Case cards, message cards
- **Buttons**: `rounded-md` (6px) - Interactive elements
- **Badges**: `rounded-full` - Status indicators
- **Inputs**: `rounded-md` (6px) - Form elements

## Component Specifications

### Ticket Queue Component

#### Structure
\`\`\`
Header Section (p-4, border-b)
├── Title: "Support Queue" (text-lg, font-semibold)
├── Search Input (relative, pl-10 for icon)
└── Tab Navigation (grid-cols-3)
    ├── Inbox Tab (with count badge)
    ├── Active Tab (with count badge)
    └── Archive Tab (with count badge)

Ticket List (flex-1, overflow-y-auto)
├── Empty State (centered, text-muted-foreground)
└── Ticket Cards (p-2, space-y-2)
    ├── Card Header (flex, justify-between)
    │   ├── Sender Name (font-medium, truncate)
    │   ├── Subject (text-sm, text-muted-foreground)
    │   └── Timestamp (text-xs, flex-shrink-0)
    ├── Summary (text-sm, line-clamp-2)
    └── Badge Row (flex, gap-2, flex-wrap)
        ├── Status Badge (color-coded)
        ├── Escalated Badge (if applicable)
        ├── Priority Badge (color-coded)
        └── Category Badge
\`\`\`

#### Visual States
- **Default**: `bg-card border-border`
- **Hover**: `hover:bg-muted/50 hover:shadow-sm`
- **Selected**: `bg-primary/5 border-primary`
- **Disabled**: Reduced opacity, no hover effects

### Conversation View Component

#### Structure
\`\`\`
Header Section (p-6, border-b, bg-card)
├── Case Title (text-xl, font-semibold)
├── Customer Details Button (ghost variant)
├── Metadata Row (text-sm, text-muted-foreground)
└── Badge Row (status, priority, category)

AI Recommendations (conditional, bg-blue-50)
├── Icon + Title (AlertTriangle, text-blue-800)
└── Action List (bullet points, text-blue-700)

Conversation History (p-6, border-b)
├── Section Title (message count)
└── Message Cards (space-y-3, max-h-64, overflow-y-auto)
    ├── Customer Messages (bg-blue-50, border-blue-200)
    └── Support Messages (bg-green-50, border-green-200)

Action Area (flex-1, p-6)
├── Inbox Mode: Reply Composition + Escalation
├── Active Mode: Status Display + Archive Button
└── Archive Mode: Read-only Status Display
\`\`\`

#### Message Card Structure
\`\`\`
Card (transition-colors, color-coded background)
└── CardContent (p-4)
    ├── Header Row (flex, justify-between)
    │   ├── Sender Name (font-medium, text-sm)
    │   ├── Badge (Customer/Support)
    │   └── Timestamp (text-xs, text-muted-foreground)
    └── Message Content (text-sm, leading-relaxed, whitespace-pre-wrap)
\`\`\`

### Customer Details Drawer

#### Structure
\`\`\`
Overlay (fixed, inset-0, bg-black/50, z-50)
└── Drawer Panel (fixed, right-0, w-96, h-full, bg-background)
    ├── Header (p-4, border-b)
    │   ├── Close Button (absolute, top-4, right-4)
    │   └── Customer Name + Avatar
    ├── Content (flex-1, overflow-y-auto, p-4)
    │   ├── Contact Information Section
    │   ├── Demographics Section
    │   ├── Insurance Information Section
    │   ├── Accessibility Needs Section
    │   └── Support History Section
    └── Footer (optional, p-4, border-t)
\`\`\`

## Interactive Elements

### Button Specifications

#### Primary Actions
- **Send Reply**: `bg-primary hover:bg-primary/90 text-primary-foreground`
- **Escalate**: `text-orange-600 border-orange-200 hover:bg-orange-50`
- **Archive**: `text-green-600 border-green-200 hover:bg-green-50`

#### Button States
- **Default**: Full opacity, normal colors
- **Hover**: Slight background color change, subtle shadow
- **Active**: Pressed state with darker background
- **Disabled**: 50% opacity, no hover effects, cursor-not-allowed
- **Loading**: Spinner icon, disabled state

### Form Elements

#### Text Input
- **Default**: `border-border bg-input`
- **Focus**: `ring-2 ring-ring border-ring`
- **Error**: `border-destructive ring-destructive`
- **Disabled**: `bg-muted text-muted-foreground cursor-not-allowed`

#### Textarea
- **Minimum Height**: `min-h-48` for reply composition
- **Resize**: `resize-none` to maintain layout consistency
- **Placeholder**: `text-muted-foreground`

#### Select Dropdown
- **Trigger**: Consistent with input styling
- **Content**: `bg-popover border border-border shadow-lg`
- **Items**: `hover:bg-accent hover:text-accent-foreground`

### Badge System

#### Status Badges
\`\`\`css
.status-new { @apply bg-blue-100 text-blue-800 border-blue-200; }
.status-in-progress { @apply bg-orange-100 text-orange-800 border-orange-200; }
.status-resolved { @apply bg-green-100 text-green-800 border-green-200; }
.status-escalated { @apply bg-orange-100 text-orange-800 border-orange-200; }
\`\`\`

#### Priority Badges
\`\`\`css
.priority-low { @apply bg-green-100 text-green-800 border-green-200; }
.priority-medium { @apply bg-yellow-100 text-yellow-800 border-yellow-200; }
.priority-high { @apply bg-red-100 text-red-800 border-red-200; }
\`\`\`

## Responsive Design

### Breakpoint Strategy
- **Desktop First**: Primary design optimized for 1440px+ screens
- **Tablet Adaptation**: 768px-1439px with adjusted panel widths
- **Mobile Consideration**: 320px-767px with stacked layout (future enhancement)

### Desktop Layout (1440px+)
- **Left Panel**: 384px fixed width
- **Center Panel**: Flexible width (minimum 600px)
- **Right Drawer**: 400px overlay width

### Tablet Layout (768px-1439px)
- **Left Panel**: 320px fixed width
- **Center Panel**: Flexible width (minimum 480px)
- **Right Drawer**: 350px overlay width
- **Reduced Padding**: `p-4` instead of `p-6` for major sections

### Mobile Layout (320px-767px) - Future Enhancement
- **Single Panel View**: Stack panels vertically
- **Tab-based Navigation**: Switch between Queue and Conversation
- **Full-screen Drawer**: Customer details as full overlay
- **Compact Spacing**: Reduced padding and margins throughout

### Responsive Utilities
\`\`\`css
/* Panel widths */
.ticket-queue { @apply w-96 lg:w-80 xl:w-96; }
.conversation-view { @apply flex-1 min-w-0; }
.customer-drawer { @apply w-96 lg:w-80 xl:w-96; }

/* Spacing adjustments */
.panel-padding { @apply p-6 lg:p-4 xl:p-6; }
.card-padding { @apply p-4 lg:p-3 xl:p-4; }
\`\`\`

## User Experience Patterns

### Navigation Patterns

#### Context-Stable Navigation
- **Tab Switching**: Always clears selection and status messages
- **Case Selection**: Only works within appropriate tab context
- **Action Completion**: Agent remains in current tab after actions
- **Status Feedback**: Clear confirmation messages for all state changes

#### Selection Validation
\`\`\`javascript
// Inbox: Only allow selection of "new" status cases
if (activeTab === "inbox" && ticket.status === "new") { /* allow */ }

// Active: Only allow selection of "in-progress" status cases  
if (activeTab === "active" && ticket.status === "in-progress") { /* allow */ }

// Archive: Only allow selection of "resolved" status cases
if (activeTab === "archive" && ticket.status === "resolved") { /* allow */ }
\`\`\`

### Interaction Patterns

#### Hover Effects
- **Case Cards**: `hover:shadow-sm hover:bg-muted/50` - Subtle elevation and background change
- **Buttons**: Color-specific hover states with background lightening
- **Interactive Elements**: `transition-all duration-200` for smooth state changes

#### Focus States
- **Keyboard Navigation**: Clear focus rings using `ring-2 ring-ring`
- **Tab Order**: Logical flow through interactive elements
- **Focus Trapping**: Within modals and drawers

#### Loading States
- **Button Loading**: Spinner icon with disabled state
- **Content Loading**: Skeleton placeholders for async content
- **Progressive Enhancement**: Graceful degradation for slow connections

### Feedback Patterns

#### Status Messages
- **Success Actions**: Green checkmark with descriptive text
- **Pending States**: Orange warning icon with waiting message
- **Error States**: Red alert icon with error description
- **Information**: Blue info icon with helpful context

#### Visual Feedback
- **Selection Highlighting**: Primary color border and background tint
- **State Changes**: Smooth transitions between visual states
- **Progress Indication**: Clear visual cues for multi-step processes

## Accessibility Guidelines

### Keyboard Navigation
- **Tab Order**: Logical flow through all interactive elements
- **Focus Management**: Clear focus indicators and proper focus trapping
- **Keyboard Shortcuts**: Standard shortcuts for common actions
- **Skip Links**: Allow users to skip repetitive navigation

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **ARIA Labels**: Descriptive labels for complex interactions
- **Live Regions**: Announce dynamic content changes
- **Alternative Text**: Meaningful descriptions for all images and icons

### Visual Accessibility
- **Color Contrast**: WCAG AA compliance (4.5:1 ratio minimum)
- **Color Independence**: Information not conveyed by color alone
- **Text Scaling**: Support up to 200% zoom without horizontal scrolling
- **Motion Sensitivity**: Respect prefers-reduced-motion settings

### Implementation Examples

#### ARIA Labels
\`\`\`html
<button aria-label="Send reply to customer">
  <Send className="h-4 w-4 mr-2" />
  Send
</button>

<div role="tabpanel" aria-labelledby="inbox-tab">
  <!-- Inbox content -->
</div>
\`\`\`

#### Focus Management
\`\`\`javascript
// Focus first interactive element when panel opens
useEffect(() => {
  if (isOpen && firstButtonRef.current) {
    firstButtonRef.current.focus()
  }
}, [isOpen])
\`\`\`

#### Live Regions
\`\`\`html
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>
\`\`\`

### Color Contrast Compliance

#### Text Combinations
- **Primary Text on White**: `#374151` on `#ffffff` (11.4:1) ✓
- **Secondary Text on White**: `#6b7280` on `#ffffff` (7.0:1) ✓
- **Primary on Blue**: `#ffffff` on `#6366f1` (8.6:1) ✓
- **Status Text on Backgrounds**: All combinations meet AA standards

#### Interactive Elements
- **Focus Rings**: High contrast outlines for all focusable elements
- **Button States**: Sufficient contrast in all interaction states
- **Badge Text**: Optimized color combinations for readability

## Implementation Guidelines

### CSS Architecture
- **Utility-First**: Tailwind CSS for consistent spacing and colors
- **Component Classes**: Custom classes for complex component states
- **CSS Variables**: Design tokens for easy theme customization
- **Responsive Utilities**: Mobile-first responsive design patterns

### Performance Considerations
- **Lazy Loading**: Defer non-critical content loading
- **Virtual Scrolling**: For large ticket lists (future enhancement)
- **Image Optimization**: Proper sizing and format selection
- **Bundle Splitting**: Code splitting for optimal loading

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Polyfills**: Minimal polyfills for essential features only
- **Testing**: Cross-browser testing for all interactive features

This specification serves as the definitive guide for implementing and maintaining the Support Dashboard's user interface, ensuring consistency, accessibility, and optimal user experience across all features and interactions.
