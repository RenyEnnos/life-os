> Superseded on 2026-03-28 by `docs/mvp/canonical-mvp.md`.
>
> Historical broad-suite PRD context. This document is not the canonical MVP framing for current product decisions.

# Product Requirements Document (PRD): Life OS v2.2 (The Ultimate Fusion)

**Version:** 2.2.0  
**Status:** Draft – Ready for Elite Development Team  
**Last Updated:** December 6, 2025  
**Target Audience:** Senior Architects, Full-Stack Engineers, UX/Product Designers

---

## 1. Project Manifesto

### The Mission

Create the **ultimate personal operating system**—a unified platform that combines the lightweight, feature-focused, and user-centric logic of the original `life-dashboard` with the premium, scalable, and reactive technology stack of `life-os`. This is not a collection of apps; it's a cohesive, intelligent system that anticipates user needs and adapts to their life rhythms.

### The Vibe

- **Visuals:** Premium SaaS aesthetic. Glassmorphism used strategically (overlays only). Deep, rich dark mode (`#0a0a0a`). Fluid, purposeful animations.
- **Performance:** Instant interactions (<50ms for UI, <200ms for data operations). Offline-first capability. Optimistic updates everywhere.
- **Architecture:** Enforced modularity. Strict TypeScript. Feature-based colocation. Deletability and scalability as first-class concerns.
- **Philosophy:** "User-First, Always." If a technical requirement conflicts with great UX, the UX wins. Justify the decision.

---

## 2. User Personas & Journeys

### 2.1. Personas

#### Persona 1: Pedro, 22, Engineering Student
- **Primary Goals:** Master productivity, build consistent habits, stay organized academically
- **Pain Points:** Overwhelmed by multiple apps; struggles with habit consistency; needs quick task capture
- **Tech Comfort:** High; uses multiple productivity apps; values keyboard shortcuts and automation
- **Session Pattern:** Quick morning check-in (2-3 min), evening review (5 min), sporadic throughout day
- **Key Features:** Habits, University, Tasks, Quick Capture

#### Persona 2: Maria, 35, Product Manager
- **Primary Goals:** Optimize time allocation, track finances, maintain well-being, achieve career goals
- **Pain Points:** Time fragmentation; financial awareness gaps; needs high-level insights
- **Tech Comfort:** High; expects premium, polished experiences; values data-driven decisions
- **Session Pattern:** Morning dashboard review (3 min), weekly deep dive (15 min), daily check-ins
- **Key Features:** Dashboard, Finances, AI Assistant, Habits, Tasks

### 2.2. User Journeys (Happy Paths)

#### Journey 1: Onboarding (First 5 Minutes)

**Scenario:** Pedro opens Life OS for the first time.

1. **Welcome Screen** → "Welcome to your personal OS, Pedro. Let's get you in control."
2. **Priority Question** → "What's your main focus right now?" (Productivity / Habits / Finances / Academic)
3. **Quick Setup** → Create 1 initial habit with a template suggestion (e.g., "Morning Routine")
4. **First Transaction** → Add a simple financial entry (e.g., "Coffee - R$ 8.00")
5. **First Task** → Create a task with a deadline
6. **Dashboard Populated** → Pedro sees a dashboard with his data, feels immediate value
7. **CTA** → "You're all set! Explore or start logging your day."

**Outcome:** In <5 minutes, Pedro has created 1 habit, 1 transaction, 1 task, and sees a meaningful dashboard.

---

#### Journey 2: Daily Routine (Morning, 2-3 Minutes)

**Scenario:** Maria opens Life OS at 7:30 AM.

1. **Dashboard Loads** → Greets "Good Morning, Maria" with:
   - **Zone 1 (Now/Urgent):** "2 critical tasks for today" + "University assignment due in 6 hours"
   - **Zone 2 (Today):** Habits to complete + Tasks for the day
   - **Zone 3 (Context):** Mini finance summary + AI insight ("You're 15% under budget this week")
2. **Habits Check** → Maria clicks 3 habits (Morning Meditation, Exercise, Reading). Smooth animations, instant feedback.
3. **Quick Capture** → She dictates: "Review Q4 roadmap by 2 PM". System shows preview: "✅ Create Task: 'Review Q4 roadmap' with deadline today at 2 PM". She confirms.
4. **Finance Glance** → Sees "You spent 23% less than average this week" (natural language summary).
5. **Exit** → Maria feels in control and informed. Total time: 2:45 minutes.

**Outcome:** Maria has logged habits, captured a task, and gained insights—all in under 3 minutes.

---

#### Journey 3: Weekly Review (Sunday Evening, 15 Minutes)

**Scenario:** Pedro uses the AI Assistant for a weekly retrospective.

1. **AI Assistant Opens** → FAB button → Chat interface
2. **Pedro Asks:** "How was my productivity this week?"
3. **AI Responds:** 
   - "You completed 18/21 habits (86% consistency). Your best day was Wednesday."
   - "You finished 7 out of 9 tasks on time."
   - "Your 'Reading' habit had 0 completions on Friday—want to explore why?"
4. **Pedro Asks:** "Why am I failing at Reading?"
5. **AI Provides Insight:** "Pattern detected: You skip Reading on Fridays when you have late meetings. Suggestion: Move it to Sunday morning instead."
6. **Pedro Asks:** "Create a study plan for my Anatomy exam next week."
7. **AI Generates:** A structured 7-day study plan with daily tasks, integrated into his Tasks feature.
8. **Pedro Reviews:** Sees the plan in his dashboard, confirms it, and feels prepared.

**Outcome:** Pedro has clarity on his week, actionable insights, and a concrete study plan—all through natural conversation.

---

## 3. Out of Scope (v2.2)

The following features are **explicitly NOT** included in this version:

- **Multi-user collaboration** (shared habits, team dashboards)
- **Banking integrations** (direct account linking, automatic transaction imports)
- **Multi-language support** (currently Portuguese only)
- **Mobile app** (web-responsive only in v2.2)
- **Social features** (leaderboards, friend challenges—gamification is personal only)
- **Advanced calendar integration** (Google Calendar sync, Outlook sync)
- **Voice commands** (voice input for Quick Capture is out of scope)
- **Export/Import** (data portability features)

**Rationale:** These features can be added in v2.3+ without architectural changes. The current scope is laser-focused on delivering a premium, cohesive single-user experience.

---

## 4. Technical Standards & Stack

### 4.1. Core Technology

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Framework** | React 18.2+ | Industry standard, excellent ecosystem, strong typing with TS |
| **Build Tool** | Vite 5+ | SWC compiler for blazing-fast builds; <50ms HMR |
| **Language** | TypeScript 5.3+ (Strict Mode) | Zero `any` types; enforced type safety |
| **Styling** | Tailwind CSS 3.4+ | Mobile-first, utility-first; no `.css` files except `globals.css` |
| **Animation** | Framer Motion | Declarative, physics-based; respects `prefers-reduced-motion` |
| **Icons** | Lucide React | Unified stroke width; 400+ icons; lightweight |
| **Backend** | Supabase (PostgreSQL) | Real-time, open-source, excellent DX |
| **AI Provider** | Groq Cloud (Llama 3 70B / Mixtral 8x7B) | Sub-2s latency; cost-effective; excellent reasoning |

### 4.2. State Management & Caching

**Server State (The Source of Truth):**
- **Library:** `@tanstack/react-query` v5
- **Role:** Data fetching, caching, synchronization, optimistic updates
- **Pattern:** Factory pattern for query keys (e.g., `habitsKeys.all`, `habitsKeys.detail(id)`)
- **TTL:** Stale time = 5 minutes; Cache time = 30 minutes

**Client State (UI & Interactions):**
- **Library:** `zustand`
- **Stores:** Atomic (e.g., `useUIStore`, `useAuthStore`, `useModalStore`)
- **Pattern:** Minimal; only UI state, not business logic
- **Persistence:** `localStorage` for theme, sidebar state, recent filters

### 4.3. AI Infrastructure

- **Provider:** Groq Cloud
- **Models:** Llama 3 70B (default), Mixtral 8x7B (fallback)
- **Interface:** `groq-sdk` (TypeScript)
- **Execution:** Client-side via Proxy Edge Function (Supabase Edge Functions)
- **Latency Target:** <2s for complex analysis; <500ms for quick suggestions
- **Context Window:** Full user state (tasks, habits, transactions) passed as context
- **Safety:** AI never modifies data without explicit user confirmation

### 4.4. Offline-First Policy

**Offline Capability:**

| Feature | Offline Support | Sync Strategy |
|---------|-----------------|----------------|
| **Habits** | ✅ Full (log, view) | Queue + sync on reconnect |
| **Tasks** | ✅ Full (CRUD, view) | Queue + sync on reconnect |
| **Finances** | ✅ Full (add, view) | Queue + sync on reconnect |
| **University** | ✅ Read-only | Cache + sync on reconnect |
| **Dashboard** | ✅ Read-only (cached) | Refresh on reconnect |
| **AI Assistant** | ❌ Not available | Requires connection |

**Implementation:**
- **Service Workers:** Cache-first strategy for static assets; network-first for API calls
- **IndexedDB:** Local database for all user data; synced with Supabase
- **Sync Queue:** Automatic queue of pending mutations; processed on reconnect
- **Visual Indicator:** "Offline Mode" badge in top-right; grayed-out AI Assistant
- **Conflict Resolution:** Last-write-wins for non-critical data; user prompt for critical conflicts

---

## 5. Architecture & File Structure (Strict Enforcement)

### Hybrid Feature Architecture (Colocation + Modularity)

```
src/
├── app/
│   ├── main.tsx                    # React 18 entry point
│   ├── App.tsx                     # Route definitions (React Router v6)
│   ├── providers.tsx               # QueryClientProvider, ThemeProvider, AuthProvider
│   └── layout/
│       ├── Shell.tsx               # Main layout (Sidebar + Topbar + Content)
│       ├── Sidebar.tsx             # Navigation sidebar
│       └── Topbar.tsx              # Header with search, profile, settings
│
├── features/                       # DOMAIN-DRIVEN MODULES
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useSession.ts
│   │   ├── api/
│   │   │   ├── auth.api.ts
│   │   │   └── auth.keys.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── habits/
│   │   ├── components/
│   │   │   ├── HabitHeatmap.tsx
│   │   │   ├── HabitItem.tsx
│   │   │   ├── HabitList.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   └── HabitDoctor.tsx     # AI-powered insights
│   │   ├── hooks/
│   │   │   ├── useHabitLog.ts
│   │   │   ├── useHabitStats.ts
│   │   │   └── useHabitAnalytics.ts
│   │   ├── api/
│   │   │   ├── habits.api.ts
│   │   │   └── habits.keys.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── tasks/
│   │   ├── components/
│   │   │   ├── TaskKanban.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   └── QuickCaptureInput.tsx
│   │   ├── hooks/
│   │   │   ├── useTaskCRUD.ts
│   │   │   └── useTaskFilters.ts
│   │   ├── api/
│   │   │   ├── tasks.api.ts
│   │   │   └── tasks.keys.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── finances/
│   │   ├── components/
│   │   │   ├── TransactionTable.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── FinanceCharts.tsx
│   │   │   ├── CategorySuggester.tsx  # AI-powered
│   │   │   └── FinanceSummary.tsx
│   │   ├── hooks/
│   │   │   ├── useTransactionCRUD.ts
│   │   │   └── useFinanceAnalytics.ts
│   │   ├── api/
│   │   │   ├── finances.api.ts
│   │   │   └── finances.keys.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── university/
│   │   ├── components/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── AssignmentKanban.tsx
│   │   │   ├── GradeCalculator.tsx
│   │   │   ├── WhatIfSimulator.tsx    # AI-powered
│   │   │   └── UniversitySummary.tsx
│   │   ├── hooks/
│   │   │   ├── useCourseCRUD.ts
│   │   │   ├── useAssignmentCRUD.ts
│   │   │   └── useGradeCalculation.ts
│   │   ├── api/
│   │   │   ├── university.api.ts
│   │   │   └── university.keys.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx         # Main container
│   │   │   ├── Zone1_Now.tsx         # Urgent/Now zone
│   │   │   ├── Zone2_Today.tsx       # Today zone
│   │   │   ├── Zone3_Context.tsx     # Context zone
│   │   │   ├── WelcomeWidget.tsx
│   │   │   ├── HabitsTodayWidget.tsx
│   │   │   ├── FinanceMiniWidget.tsx
│   │   │   ├── UniversityUrgentWidget.tsx
│   │   │   └── DashboardEmpty.tsx
│   │   ├── hooks/
│   │   │   ├── useDashboardData.ts
│   │   │   └── useDashboardLayout.ts
│   │   ├── api/
│   │   │   ├── dashboard.api.ts
│   │   │   └── dashboard.keys.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── ai-assistant/
│       ├── components/
│       │   ├── AIChat.tsx            # Chat interface
│       │   ├── ChatMessage.tsx
│       │   ├── ChatInput.tsx
│       │   └── AIChatFAB.tsx         # Floating action button
│       ├── hooks/
│       │   ├── useAIChat.ts
│       │   └── useAIContext.ts
│       ├── api/
│       │   ├── ai.api.ts
│       │   └── ai.keys.ts
│       ├── types.ts
│       └── index.ts
│
├── shared/                         # GENERIC UTILITIES
│   ├── ui/                         # Design System (Atomic Components)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Dialog.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Spinner.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tabs.tsx
│   │   ├── Skeleton.tsx            # Loading state
│   │   └── index.ts
│   │
│   ├── lib/
│   │   ├── cn.ts                   # clsx + tailwind-merge
│   │   ├── date.ts                 # date-fns wrappers
│   │   ├── format.ts               # Currency, numbers formatting
│   │   ├── validation.ts           # Zod schemas
│   │   └── constants.ts            # App-wide constants
│   │
│   ├── api/
│   │   ├── supabase.ts             # Singleton Supabase client
│   │   ├── groq.ts                 # Groq AI client
│   │   └── http.ts                 # HTTP utilities
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useAsync.ts
│   │   └── useMediaQuery.ts
│   │
│   └── types/
│       ├── common.ts               # Shared types
│       └── database.ts             # Database schema types
│
├── styles/
│   └── globals.css                 # Tailwind @base, @components, @utilities
│
└── config/
    ├── routes.ts                   # Route definitions
    └── env.ts                      # Environment variables
```

**Key Principles:**
- **No root `/components`** → All components live in feature folders
- **Public Barrier** → Each feature exports only via `index.ts`
- **Colocation** → Related code (components, hooks, API) lives together
- **Deletability** → Remove a feature folder = remove the feature completely
- **Scalability** → Add new features without touching existing code

---

## 6. Database Schema (Supabase/PostgreSQL)

### Core Tables

#### `users` (Managed by Supabase Auth)
```sql
id                UUID PRIMARY KEY (auto-generated)
email             TEXT UNIQUE NOT NULL
created_at        TIMESTAMPTZ DEFAULT now()
```

#### `profiles`
```sql
id                UUID PRIMARY KEY (FK users.id)
full_name         TEXT
avatar_url        TEXT
points            INT DEFAULT 0                    -- Gamification
level             INT DEFAULT 1                    -- Gamification
streak_days       INT DEFAULT 0                    -- Current streak
best_streak       INT DEFAULT 0                    -- Best streak ever
settings          JSONB DEFAULT '{}'               -- Theme, preferences, notifications
created_at        TIMESTAMPTZ DEFAULT now()
updated_at        TIMESTAMPTZ DEFAULT now()
```

#### `habits`
```sql
id                UUID PRIMARY KEY
user_id           UUID NOT NULL (FK profiles.id)
title             TEXT NOT NULL
description       TEXT
color             TEXT DEFAULT '#8b5cf6'           -- Tailwind color
frequency         JSONB NOT NULL                  -- ['Mon', 'Wed', 'Fri']
time_of_day       ENUM ('morning', 'afternoon', 'evening')
is_quantified      BOOLEAN DEFAULT FALSE           -- Binary vs quantified
unit              TEXT                             -- e.g., "pages", "km"
target_value      INT                              -- e.g., 50 pages
icon              TEXT DEFAULT 'target'            -- Lucide icon name
created_at        TIMESTAMPTZ DEFAULT now()
updated_at        TIMESTAMPTZ DEFAULT now()
```

#### `habit_logs`
```sql
id                UUID PRIMARY KEY
habit_id          UUID NOT NULL (FK habits.id)
completed_at      DATE NOT NULL                    -- YYYY-MM-DD
value             INT                              -- For quantified habits
notes             TEXT
created_at        TIMESTAMPTZ DEFAULT now()
```

#### `tasks`
```sql
id                UUID PRIMARY KEY
user_id           UUID NOT NULL (FK profiles.id)
title             TEXT NOT NULL
description       TEXT
status            ENUM ('todo', 'in_progress', 'done') DEFAULT 'todo'
priority          ENUM ('low', 'medium', 'high', 'critical') DEFAULT 'medium'
due_date          TIMESTAMPTZ
project_id        UUID                             -- Optional grouping
created_at        TIMESTAMPTZ DEFAULT now()
updated_at        TIMESTAMPTZ DEFAULT now()
```

#### `transactions`
```sql
id                UUID PRIMARY KEY
user_id           UUID NOT NULL (FK profiles.id)
amount            NUMERIC(12, 2) NOT NULL
type              ENUM ('income', 'expense') NOT NULL
category          TEXT NOT NULL
description       TEXT
date              DATE NOT NULL
created_at        TIMESTAMPTZ DEFAULT now()
```

#### `university_courses`
```sql
id                UUID PRIMARY KEY
user_id           UUID NOT NULL (FK profiles.id)
name              TEXT NOT NULL
professor         TEXT
schedule          TEXT                             -- e.g., "Mon/Wed 10:00-12:00"
color             TEXT DEFAULT '#06b6d4'
semester          TEXT                             -- e.g., "2025-1"
created_at        TIMESTAMPTZ DEFAULT now()
```

#### `university_assignments`
```sql
id                UUID PRIMARY KEY
course_id         UUID NOT NULL (FK university_courses.id)
title             TEXT NOT NULL
type              ENUM ('exam', 'homework', 'paper', 'project') NOT NULL
due_date          TIMESTAMPTZ NOT NULL
grade             NUMERIC(5, 2)                    -- NULL until graded
weight            NUMERIC(5, 2) NOT NULL DEFAULT 1.0
status            ENUM ('todo', 'submitted', 'graded') DEFAULT 'todo'
created_at        TIMESTAMPTZ DEFAULT now()
updated_at        TIMESTAMPTZ DEFAULT now()
```

#### `journals` (New in v2.2)
```sql
id                UUID PRIMARY KEY
user_id           UUID NOT NULL (FK profiles.id)
content           TEXT NOT NULL
created_at        TIMESTAMPTZ DEFAULT now()
updated_at        TIMESTAMPTZ DEFAULT now()
```

### Indexes for Performance

```sql
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX idx_habit_logs_completed_at ON habit_logs(completed_at);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_university_courses_user_id ON university_courses(user_id);
CREATE INDEX idx_university_assignments_course_id ON university_assignments(course_id);
CREATE INDEX idx_journals_user_id ON journals(user_id);
```

---

## 7. Detailed Feature Specifications

### 7.1. Dashboard (The Nerve Center)

**Philosophy:** The dashboard is the **single source of truth** for what matters right now. It's not a collection of widgets; it's a carefully orchestrated narrative of the user's day.

#### Layout: Three Zones (Hierarchical)

| Zone | Name | Content | Visibility |
|------|------|---------|-----------|
| **Zone 1** | **Now (Urgent)** | 2-3 critical tasks + immediate action items | Always visible (top-left) |
| **Zone 2** | **Today** | Habits for today + tasks due today | Always visible (center) |
| **Zone 3** | **Context** | Mini finance summary + university urgent + AI insight | Below the fold / mobile: collapsed |

#### Dynamic Prioritization (Time-Based)

The dashboard adapts based on time of day:

- **7:00 AM - 12:00 PM (Morning):** Prioritize "Habits Today" + "University Urgent" + "Tasks"
- **12:00 PM - 6:00 PM (Afternoon):** Prioritize "Tasks" + "Finance Mini" + "Habits Today"
- **6:00 PM - 11:00 PM (Evening):** Prioritize "Journal" + "Reflection" + "Weekly Review" (if Sunday)

#### Widgets

**Widget 1: Welcome Card**
```
Good Morning, Pedro
You have 2 critical tasks for today.
```
- Dynamic greeting based on time of day
- Subtitle: Count of critical/high-priority tasks
- CTA: "View all tasks"

**Widget 2: Habits Today**
- Circular checkboxes for each habit (max 7 visible; scroll if more)
- Instant optimistic update on click
- Confetti animation on 100% completion
- Streak counter badge on each habit
- Hover: Shows habit details (time, frequency)

**Widget 3: Finance Mini**
- **Visual:** Bar chart of last 7 days spending
- **Summary:** "You spent 23% less than average this week" (natural language)
- **Indicator:** Green (under budget) / Red (over budget)
- **CTA:** "View full finances"

**Widget 4: University Urgent**
- Shows next assignment due in <48h (if any)
- Format: "Anatomy Exam due in 6 hours"
- Progress bar if partially completed
- CTA: "View all assignments"

**Widget 5: Quick Capture Input**
- Placeholder: "What's on your mind?"
- Icon: Microphone (future voice feature)
- On focus: Expands to show 3 options (see Section 7.1.1)

#### States

**Empty State (No Data)**
- Friendly illustration + text: "You haven't created any habits yet. Let's start with one!"
- CTA: "Create your first habit"
- Suggested habits: "Morning Routine", "Exercise", "Reading"

**Overload State (Many Cards)**
- Masonry layout with responsive columns (3 cols desktop, 2 cols tablet, 1 col mobile)
- Scroll within Zone 1 if too many critical items
- Collapsible sections for Zone 3

#### Responsive Behavior

| Breakpoint | Layout | Priority |
|-----------|--------|----------|
| **Desktop** (1024px+) | 3-column grid; all zones visible | Zone 1 → Zone 2 → Zone 3 |
| **Tablet** (768px-1023px) | 2-column; Zone 3 collapsed | Zone 1 → Zone 2 (Zone 3 below fold) |
| **Mobile** (<768px) | 1-column stack; Zone 3 hidden | Zone 1 → Zone 2 (Zone 3 in drawer) |

---

### 7.1.1. Quick Capture Input (Refined Flow)

**Problem Solved:** The original Quick Capture was vague. This specifies the exact UX flow.

**User Input:** "Revisar o design do novo feature amanhã às 15h"

**System Flow:**

1. **AI Parsing** → Extracts: action="revisar", object="design do novo feature", date="tomorrow", time="15:00"
2. **Decision Logic:**
   - Has action verb + date/time → **Task**
   - Is reflective/journalistic → **Journal**
   - Has repetition pattern ("todo dia", "toda segunda") → **Habit**
3. **Preview Modal** → Shows 3 options:
   - ✅ **Adicionar como Tarefa** (default selected)
     - Title: "Revisar o design do novo feature"
     - Due: "Amanhã às 15:00"
   - ✅ **Criar como Hábito**
     - Title: "Revisar designs"
     - Frequency: "Diariamente"
   - ✅ **Registrar no Journal**
     - Content: "Revisar o design do novo feature amanhã às 15h"
4. **User Confirms** → One-click confirmation
5. **Visual Feedback** → Toast: "✅ Tarefa criada: 'Revisar o design do novo feature' para amanhã às 15h" (2s, auto-dismiss)

**Key Rules:**
- AI never modifies data without user confirmation
- Preview always shows what will be created
- User can edit before confirming
- Keyboard shortcut: `Cmd+K` to focus input

---

### 7.2. Habits (The Growth Engine)

**Philosophy:** Habits are the foundation of personal growth. This feature celebrates consistency and provides intelligent feedback.

#### UI: Multi-Level Zoom

| Level | View | Use Case |
|-------|------|----------|
| **Today** | Circular checkboxes; quick log | Daily check-in |
| **Week** | List with daily status; mini heatmap | Weekly review |
| **Year** | GitHub-style heatmap; streaks; analytics | Long-term trends |

#### Heatmap (GitHub-Style)

- **Scope:** All habits combined (unified consistency view)
- **Color Coding:** Grayscale intensity (white = no completion, dark = multiple completions)
- **Interaction:** Hover = tooltip with date + completion count
- **Mobile:** Horizontal scroll; compressed view

#### Analytics Section

| Metric | Calculation | Display |
|--------|-------------|---------|
| **Best Streak** | Longest consecutive days | "🔥 47 days" |
| **Current Streak** | Days since last break | "🔥 12 days" |
| **Completion Rate** | (Completed / Expected) × 100 | "86% this month" |
| **Total Completions** | Sum of all logs | "342 total" |

#### Habit Doctor (AI-Powered Insights)

**Trigger:** Button "Why am I failing?" in habit details

**AI Analysis:**
1. Fetches habit logs for last 30 days
2. Identifies patterns (e.g., "Always skip on Fridays")
3. Correlates with other data (time of day, day of week, concurrent tasks)
4. Generates suggestion: "You always skip 'Reading' on Fridays. Suggestion: Move it to Sunday morning instead."

**Output:** Conversational, actionable, specific

#### Empty State

- Friendly message: "You haven't created any habits yet. Suggestions from AI:"
- AI-generated habit suggestions based on persona (if available)
- CTA: "Create your first habit"

#### Feedback Animations

- **Check:** Smooth check animation (0.3s); optional sound (configurable)
- **Confetti:** On 100% daily completion; can be disabled in settings
- **Streak Milestone:** Badge animation at 7, 30, 100 days

---

### 7.3. Finances (The Wealth Manager)

**Philosophy:** Financial awareness without friction. AI helps with categorization; natural language summaries replace jargon.

#### UI: Table + Summary Cards

**Summary Cards (Top):**
- **Balance:** Current month total (income - expenses)
- **Average Daily Spend:** (Total expenses / days elapsed)
- **Budget Status:** "You're 15% under budget this week"
- **Top Category:** "Delivery: R$ 450 (32% of spending)"

**Transaction Table (TanStack Table):**
- Columns: Date | Description | Category | Amount | Actions
- Sortable by date, amount, category
- Filterable by date range, category
- Inline edit/delete with confirmation

#### AI-Powered Category Suggestion

**When:** User adds a new transaction

**Flow:**
1. User enters description: "Uber para o trabalho"
2. AI suggests category: "Transport" (confidence: 95%)
3. User can accept or override
4. System learns from corrections

#### Charts

- **Area Chart:** Balance history (last 90 days)
- **Donut Chart:** Categorical breakdown (current month)
- **Bar Chart:** Daily spending (last 7 days)

#### Natural Language Summaries

Instead of raw numbers:
- ❌ "Expense: R$ 450.00"
- ✅ "You spent 23% more on Delivery this week than last week"

#### Empty State

- Friendly message: "Add your first transaction to start tracking."
- Example: "Almoço - R$ 30,00 - Categoria: Alimentação"
- CTA: "Add transaction"

---

### 7.4. University (The Academic Tracker)

**Philosophy:** Students need to know their current standing at any moment. The feature provides clarity on grades, deadlines, and what-if scenarios.

#### Core Principle

> **"At any moment, the student knows their chance of passing each course."**

#### Grade Calculation

**Formula:** `Average = Sum(Grade × Weight) / Sum(Weight)`

**Example:**
- Homework (weight 0.2): 8.0 → 1.6
- Midterm (weight 0.3): 7.5 → 2.25
- Final (weight 0.5): 8.5 → 4.25
- **Average = (1.6 + 2.25 + 4.25) / 1.0 = 8.1**

#### UI: Kanban Board

**Columns:** To Do | Submitted | Graded | Archived

**Cards:**
- Course name (color-coded)
- Assignment title
- Due date + countdown
- Grade (if graded) or status
- Drag-to-move between columns

#### Course Card (Summary View)

- Course name + professor
- Current average grade (large, prominent)
- Next deadline
- Progress bar (assignments completed / total)
- CTA: "View assignments"

#### What-If Simulator (AI-Powered)

**Scenario:** "If I get 7 on the final exam, what will my average be?"

**Flow:**
1. User enters hypothetical grade: 7.0
2. AI calculates: "Your average would be 7.8. You'd pass with a 7.5 threshold."
3. Shows impact on course grade

#### Semester/Period Management

- Dropdown to select semester (e.g., "2025-1", "2025-2")
- Archive past semesters
- View historical data

#### No-Show Handling

- Assignment without submission: Shows as "No Submission"
- Doesn't count toward average (grading-dependent)
- Visual indicator: Grayed out or strikethrough

#### Empty State

- "Add your courses to get started."
- CTA: "Add course"

---

### 7.5. AI Assistant ("Life OS Intelligence")

**Philosophy:** The AI is a personal advisor, not a chatbot. It acts, suggests, and learns from the user's patterns.

#### Interface

- **FAB (Floating Action Button):** Bottom-right corner; always accessible
- **Chat Interface:** Minimalist; message bubbles; typing indicator
- **Context:** AI has read-access to user's local state (tasks, habits, finances, university data)

#### Interaction Modes

| Mode | Trigger | Example | Output |
|------|---------|---------|--------|
| **Insight** | User asks about data | "How was my productivity last week?" | Analysis + metrics |
| **Command** | User requests action | "Create a study plan for Anatomy" | Generated plan + confirmation |
| **Copilot** | User describes context | "I'm on the finances page; help me interpret this" | Contextual explanation |

#### System Prompt

> "You are the Life OS Pivot, a hyper-intelligent personal assistant. You have access to the user's data (habits, tasks, finances, university assignments). Your goal is to maximize their output and well-being. Be concise, direct, and slightly witty. Never modify user data without explicit confirmation. Provide actionable insights, not generic advice."

#### 10 Specific Use Cases

1. **"Analyze my productivity this week"** → Habits completed, tasks finished, patterns
2. **"Why am I failing at Reading?"** → Pattern analysis + suggestions
3. **"Create a study plan for Anatomy exam"** → 7-day structured plan
4. **"What's my average spending on Delivery?"** → Category analysis
5. **"Will I pass Economics if I get 6 on the final?"** → What-if calculation
6. **"Suggest a new habit based on my data"** → Personalized recommendation
7. **"How much did I spend on Transport last month?"** → Category summary
8. **"What are my top 3 habits by consistency?"** → Ranking + metrics
9. **"Create 5 tasks for my Anatomy study plan"** → Bulk task generation
10. **"What's my next deadline?"** → Upcoming assignments + tasks

#### Autonomy Boundaries

- ✅ **Can:** Suggest, analyze, create (with confirmation)
- ❌ **Cannot:** Modify data without explicit user confirmation
- ❌ **Cannot:** Delete data
- ❌ **Cannot:** Access other users' data

#### Confirmation Flow

**Example:** User asks "Create a study plan for Anatomy exam"

1. AI generates plan
2. Shows preview: "I'll create 5 tasks over 7 days. Confirm?"
3. User confirms
4. Tasks are created; toast notification

---

## 8. UI Component System & Design Tokens

### 8.1. Design Tokens

#### Colors (Tailwind Config)

| Token | Value | Hex | Use Case |
|-------|-------|-----|----------|
| **background** | `0 0% 3.9%` | `#0a0a0a` | Main background |
| **foreground** | `0 0% 98%` | `#fafafa` | Text on background |
| **card** | `0 0% 3.9%` | `#0a0a0a` | Card background |
| **card-border** | `0 0% 14.9%` | `#262626` | Card border |
| **primary** | `262 83% 58%` | `#a78bfa` | Primary actions (Violet) |
| **primary-dark** | `262 83% 48%` | `#8b5cf6` | Primary hover |
| **secondary** | `240 5% 96%` | `#f3f4f6` | Secondary actions |
| **destructive** | `0 84.2% 60.2%` | `#ef4444` | Danger actions |
| **muted** | `0 0% 45%` | `#737373` | Disabled, muted text |
| **muted-foreground** | `0 0% 63%` | `#a1a1a1` | Secondary text |

**Dark Mode Variations:**
- **Hover State:** `#1a1a1a` (slightly lighter than background)
- **Active State:** `#262626` (card border shade)

#### Typography

| Level | Font Size | Font Weight | Line Height | Use Case |
|-------|-----------|-------------|-------------|----------|
| **H1** | 2.25rem (36px) | 700 | 1.2 | Page titles |
| **H2** | 1.875rem (30px) | 700 | 1.3 | Section titles |
| **H3** | 1.5rem (24px) | 600 | 1.4 | Subsection titles |
| **Body** | 1rem (16px) | 400 | 1.6 | Main content |
| **Small** | 0.875rem (14px) | 400 | 1.5 | Secondary content |
| **Tiny** | 0.75rem (12px) | 400 | 1.4 | Labels, captions |

**Font Family:** `Inter` or `Geist Sans` (system fonts as fallback)

#### Spacing Scale

| Token | Value | Use Case |
|-------|-------|----------|
| **xs** | 4px | Micro spacing (icon padding) |
| **sm** | 8px | Small spacing (button padding) |
| **md** | 16px | Default spacing (card padding) |
| **lg** | 24px | Large spacing (section spacing) |
| **xl** | 32px | Extra large spacing (page padding) |

#### Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| **sm** | 4px | Small elements (badges) |
| **md** | 8px | Default (buttons, inputs) |
| **lg** | 12px | Large elements (cards) |
| **xl** | 16px | Extra large (modals) |
| **2xl** | 24px | Rounded cards |

#### Shadows

| Token | Value | Use Case |
|-------|-------|----------|
| **sm** | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| **md** | `0 4px 6px rgba(0,0,0,0.1)` | Default elevation |
| **lg** | `0 10px 15px rgba(0,0,0,0.2)` | Modal/drawer elevation |
| **xl** | `0 20px 25px rgba(0,0,0,0.3)` | Floating elements |

### 8.2. Component Specifications

#### Button Component

```typescript
<Button
  variant="default" | "outline" | "ghost" | "link" | "glass"
  size="sm" | "md" | "lg" | "icon"
  isLoading={boolean}
  leftIcon={ReactNode}
  rightIcon={ReactNode}
  disabled={boolean}
>
  Label
</Button>
```

**Variants:**
- **default:** Solid primary color; hover: darker shade
- **outline:** Border + transparent background; hover: light background
- **ghost:** No background; text only; hover: light background
- **link:** Text decoration; no background
- **glass:** Glassmorphism (backdrop-blur); overlay only

**Sizes:**
- **sm:** 8px padding; 14px font
- **md:** 12px padding; 16px font (default)
- **lg:** 16px padding; 18px font
- **icon:** 40px square; centered icon

#### Card Component

```typescript
<Card
  hoverEffect={boolean}
  className={string}
>
  {children}
</Card>
```

**Props:**
- **hoverEffect:** Adds lift (transform) + glow (shadow) on hover
- **Default Styling:** `rounded-lg border border-card-border bg-card p-md`

#### Modal/Dialog Component

```typescript
<Modal
  isOpen={boolean}
  onClose={() => void}
  title={string}
  size="sm" | "md" | "lg"
>
  {children}
</Modal>
```

**Animation:** Fade in + Scale up (0.2s, ease-out)
**Accessibility:** Uses `radix-ui/react-dialog` primitives
**Backdrop:** Dark overlay with 0.5 opacity

#### Input Component

```typescript
<Input
  type="text" | "email" | "number" | "date"
  placeholder={string}
  value={string}
  onChange={(e) => void}
  error={string}
  disabled={boolean}
  leftIcon={ReactNode}
  rightIcon={ReactNode}
/>
```

**Styling:**
- Border: `1px solid border-card`
- Padding: `8px 12px`
- Focus: `border-primary outline-none`
- Error: `border-destructive`

#### Toast Component

```typescript
toast.success("Message", { duration: 2000 })
toast.error("Message", { action: "Retry" })
toast.info("Message")
```

**Positioning:** Top-right corner
**Auto-dismiss:** 2s for success, 4s for error
**Max Stack:** 3 toasts

---

## 9. System-Wide Experiences

### 9.1. Onboarding Flow

**Goal:** In 5 minutes, new user has created 1 habit, 1 transaction, 1 task, and sees a meaningful dashboard.

#### Step 1: Welcome (30 seconds)
- **Screen:** "Welcome to Life OS"
- **Subtitle:** "Your personal operating system"
- **CTA:** "Get Started"

#### Step 2: Priority Question (1 minute)
- **Question:** "What's your main focus right now?"
- **Options:**
  - 🎯 **Productivity** → Focus on tasks and habits
  - 💪 **Habits** → Build consistency
  - 💰 **Finances** → Track spending
  - 🎓 **Academic** → Manage courses and grades
- **Selection:** Determines initial dashboard layout

#### Step 3: Create First Habit (1 minute)
- **Prompt:** "Let's create your first habit"
- **Template Suggestions:** "Morning Routine", "Exercise", "Reading", "Meditation"
- **User Input:** Title, frequency, time of day
- **Confirmation:** "✅ Habit created: Morning Routine"

#### Step 4: Add First Transaction (1 minute)
- **Prompt:** "Add a financial entry (optional)"
- **Example:** "Coffee - R$ 8.00"
- **Category:** AI-suggested or manual
- **Confirmation:** "✅ Transaction added"

#### Step 5: Create First Task (1 minute)
- **Prompt:** "Create your first task"
- **Input:** Title, due date (optional)
- **Confirmation:** "✅ Task created"

#### Step 6: Dashboard Preview (30 seconds)
- **Screen:** Dashboard with user's data
- **Message:** "You're all set! Explore or start logging your day."
- **CTA:** "Explore" or "Close"

**Total Time:** <5 minutes

---

### 9.2. Feedback System & Micro-interactions

**Philosophy:** Every action deserves feedback. Feedback should be subtle, fast, and purposeful.

#### Loading States

- **Skeleton Screens:** Preferred over spinners (less jarring)
- **Placeholder:** Gray background with shimmer animation
- **Duration:** Max 2s; if longer, show spinner

**Example:**
```
┌─────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← Shimmer animation
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└─────────────────┘
```

#### Success States

- **Toast:** Green icon + message; 2s auto-dismiss
- **Example:** "✅ Habit logged successfully"
- **Sound:** Optional (configurable in settings)

#### Error States

- **Toast:** Red icon + message + "Retry" button
- **Duration:** 4s (longer than success)
- **Example:** "❌ Failed to save task. Retry?"
- **Inline Errors:** Below form fields (red text, 12px)

#### Confirmation Modals

- **Trigger:** Destructive actions (delete, archive)
- **Content:** Clear question + consequences
- **Buttons:** "Cancel" (outline) | "Delete" (destructive)
- **Countdown:** 3s before action executes (if user doesn't cancel)

**Example:**
```
Are you sure you want to delete this habit?
This action cannot be undone.

[Cancel] [Delete (3s)]
```

#### Micro-interactions

| Interaction | Animation | Duration | Purpose |
|-------------|-----------|----------|---------|
| **Hover on card** | Lift + glow | 0.2s | Visual feedback |
| **Click habit checkbox** | Scale + check mark | 0.3s | Confirmation |
| **Complete all habits** | Confetti burst | 1s | Celebration |
| **Form error** | Shake + red border | 0.4s | Alert |
| **Modal open** | Fade in + scale up | 0.2s | Entrance |
| **Drag task** | Opacity 0.7 + shadow | Continuous | Feedback |

---

### 9.3. Gamification Mechanics

**Philosophy:** Gamification should be motivating, not addictive. Focus on progress, not competition.

#### Points System

| Action | Points | Frequency |
|--------|--------|-----------|
| **Habit completed** | +10 | Daily |
| **Task finished** | +5 | Per task |
| **Consecutive day streak** | +1 | Daily (if streak active) |
| **Weekly review** | +20 | Weekly |
| **100% habit completion** | +50 | Daily (if all habits done) |

#### Levels

- **Level 1:** 0 points
- **Level 2:** 100 points
- **Level 3:** 250 points
- **Level N:** 100 + (N-1) × 150 points

**Display:** Profile card shows current level + progress bar to next level

#### Streaks

- **Tracked per habit:** Consecutive days of completion
- **Freeze:** User can "freeze" a streak once per month (skip 1 day without breaking)
- **Display:** Fire emoji + day count (e.g., "🔥 47 days")
- **Milestone Badges:** 7 days, 30 days, 100 days

#### Badges & Rewards

| Badge | Unlock Condition | Rarity |
|-------|------------------|--------|
| 🌅 **Early Bird** | Complete 5 morning habits | Common |
| 🔥 **On Fire** | 30-day streak on any habit | Rare |
| 💯 **Perfect Week** | 100% habit completion for 7 days | Rare |
| 🎓 **Scholar** | Complete 5 university assignments | Common |
| 💰 **Saver** | Stay under budget for 4 weeks | Rare |
| 🚀 **Unstoppable** | Reach level 10 | Epic |

#### Leaderboards (Future)

- **Personal Only** in v2.2 (no social comparison)
- **Future:** Optional friend leaderboards in v2.3+

---

### 9.4. Accessibility (A11y) Standards

**Commitment:** WCAG 2.1 Level AA minimum

#### Color & Contrast

- **Contrast Ratio:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Color Blindness:** Don't rely on color alone; use icons + text
- **Dark Mode:** Ensure sufficient contrast in dark theme

#### Keyboard Navigation

- **Tab Order:** Logical, left-to-right, top-to-bottom
- **Focus Indicator:** Visible, customized (not default browser outline)
- **Keyboard Shortcuts:**
  - `Tab` / `Shift+Tab` → Navigate
  - `Enter` / `Space` → Activate
  - `Escape` → Close modal/drawer
  - `Cmd+K` / `Ctrl+K` → Open command palette

#### Screen Reader Support

- **ARIA Labels:** All interactive elements have `aria-label` or `aria-labelledby`
- **ARIA Live Regions:** Announcements for dynamic content
- **Semantic HTML:** Use `<button>`, `<input>`, `<nav>`, not `<div>` with click handlers

#### Motion & Animation

- **Respects `prefers-reduced-motion`:** Animations disabled if user has this preference
- **No Auto-play:** Videos, animations don't auto-play
- **No Flashing:** No content flashes more than 3 times per second

#### Mobile Accessibility

- **Touch Targets:** Minimum 44px × 44px
- **Readable Text:** Minimum 16px font size
- **Zoom:** Supports up to 200% zoom without horizontal scroll

#### Testing

- **Tools:** WAVE, Axe DevTools, NVDA (screen reader)
- **Manual Testing:** Keyboard-only navigation, screen reader testing
- **Continuous:** Automated A11y tests in CI/CD pipeline

---

## 10. Migration & Implementation Strategy

### Phase 1: Foundation (Week 1-2)

1. **Environment Setup**
   ```bash
   npm create vite@latest life-os -- --template react-ts
   npm install @tanstack/react-query zustand framer-motion lucide-react clsx tailwind-merge date-fns recharts @supabase/supabase-js groq-sdk
   npm install -D tailwindcss postcss autoprefixer
   ```

2. **Scaffolding**
   - Delete `src/App.css`, `src/index.css`
   - Create folder structure (Section 5)
   - Set up `src/shared/lib/cn.ts` utility
   - Configure Tailwind + PostCSS

3. **Core UI Components**
   - `Button`, `Input`, `Card`, `Modal`, `Toast`
   - `Skeleton` (loading state)
   - `Layout` (Shell, Sidebar, Topbar)

### Phase 2: Authentication & Setup (Week 2-3)

1. **Supabase Integration**
   - Create project + tables (Section 6)
   - Set up auth (email/password)
   - Create RLS policies

2. **Auth Feature**
   - Login form
   - Signup form
   - Session management
   - Protected routes

3. **Onboarding Flow**
   - 5-step wizard (Section 9.1)
   - Initial data creation

### Phase 3: Core Features (Week 3-6)

1. **Dashboard** (Week 3)
   - 3-zone layout
   - Widget components
   - Dynamic prioritization

2. **Habits** (Week 4)
   - CRUD operations
   - Heatmap visualization
   - Analytics

3. **Tasks** (Week 4-5)
   - Kanban board
   - Quick Capture input
   - Filtering/sorting

4. **Finances** (Week 5)
   - Transaction table
   - Charts
   - Category suggestion (basic)

5. **University** (Week 5-6)
   - Course management
   - Assignment Kanban
   - Grade calculation

### Phase 4: AI & Polish (Week 6-7)

1. **AI Assistant**
   - Groq integration
   - Chat interface
   - Context passing

2. **Micro-interactions**
   - Animations (Framer Motion)
   - Feedback system
   - Loading states

3. **Offline-First**
   - Service Worker setup
   - IndexedDB caching
   - Sync queue

### Phase 5: Testing & Deployment (Week 7-8)

1. **Testing**
   - Unit tests (Vitest)
   - Integration tests
   - E2E tests (Cypress)
   - A11y tests (Axe)

2. **Performance**
   - Lighthouse audit
   - Bundle analysis
   - Optimization

3. **Deployment**
   - Vercel / Netlify setup
   - CI/CD pipeline
   - Monitoring

---

## 11. Quality Assurance Checklist

### Architecture & Code Quality

- [ ] No root `/components` folder; all components in features
- [ ] All API calls isolated in `api/` folders
- [ ] Zero `any` types in codebase
- [ ] All components exported via feature `index.ts`
- [ ] Feature folders are deletable (no cross-feature imports)
- [ ] Consistent naming conventions (camelCase for files/functions, PascalCase for components)
- [ ] TypeScript strict mode enabled; no implicit `any`

### UI/UX Quality

- [ ] Premium aesthetic maintained (dark mode, glassmorphism, animations)
- [ ] Consistent spacing (4px, 8px, 16px, 24px, 32px scale)
- [ ] All interactive elements have hover states
- [ ] Micro-interactions are purposeful and smooth
- [ ] Loading states use skeleton screens (not spinners)
- [ ] Error states have clear messaging + retry options
- [ ] Empty states are friendly + actionable

### Feature Completeness

- [ ] Dashboard displays 3 zones with dynamic prioritization
- [ ] Habits feature includes heatmap, analytics, Habit Doctor
- [ ] Finances feature includes table, charts, AI categorization
- [ ] University feature calculates grades correctly; supports what-if scenarios
- [ ] Tasks feature has Quick Capture with preview flow
- [ ] AI Assistant has 10+ specific use cases implemented
- [ ] Onboarding flow completes in <5 minutes

### Performance

- [ ] UI interactions <50ms
- [ ] Data operations <200ms
- [ ] Lighthouse score >90
- [ ] Bundle size <500KB (gzipped)
- [ ] Optimistic updates implemented
- [ ] Caching strategy in place (React Query TTL)

### Accessibility

- [ ] WCAG 2.1 Level AA compliance
- [ ] Contrast ratio >4.5:1 for all text
- [ ] Keyboard navigation fully functional
- [ ] All interactive elements have ARIA labels
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Touch targets >44px × 44px
- [ ] Screen reader tested

### Offline-First

- [ ] Service Worker caches static assets
- [ ] IndexedDB stores user data
- [ ] Sync queue handles pending mutations
- [ ] "Offline Mode" badge visible when disconnected
- [ ] AI Assistant disabled when offline
- [ ] Reconnection triggers automatic sync

### Database

- [ ] All tables have proper indexes
- [ ] RLS policies enforce user isolation
- [ ] Schema supports all features (including `journals` table)
- [ ] Migrations are versioned and reversible
- [ ] Backup strategy documented

### Documentation

- [ ] README with setup instructions
- [ ] Component storybook (optional but recommended)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database schema documented
- [ ] Deployment guide

### Testing

- [ ] Unit test coverage >80%
- [ ] Integration tests for critical flows
- [ ] E2E tests for user journeys
- [ ] A11y automated tests in CI/CD
- [ ] Performance tests (Lighthouse CI)

---

## Appendix: Key Decisions & Rationale

### Decision 1: Three-Zone Dashboard Layout

**Alternative Considered:** Single flat widget grid

**Why Three Zones Win:**
- Reduces cognitive load (prioritization is automatic)
- Adapts to user's time of day
- Scales to many widgets without overwhelming
- Aligns with mental model of urgency

---

### Decision 2: AI-Driven Quick Capture vs. Manual Categorization

**Alternative Considered:** User manually selects Task/Habit/Journal

**Why AI Wins:**
- Faster (no decision fatigue)
- Preview prevents errors
- User retains control (confirmation required)
- Learns over time

---

### Decision 3: Offline-First with Service Workers

**Alternative Considered:** Online-only; cloud-first

**Why Offline Wins:**
- Resilience (works without internet)
- Performance (cached data loads instantly)
- Battery efficiency (fewer network requests)
- User trust (data is local-first)

---

### Decision 4: Gamification (Personal Only, No Social)

**Alternative Considered:** Leaderboards, friend challenges

**Why Personal Wins:**
- Avoids comparison anxiety
- Focuses on intrinsic motivation
- Simpler to implement
- Social features can be added later without breaking changes

---

### Decision 5: Glassmorphism (Overlays Only)

**Alternative Considered:** Glassmorphism everywhere

**Why Overlays Only Wins:**
- Maintains readability (solid backgrounds for main content)
- Premium aesthetic (used strategically)
- Accessibility (sufficient contrast)
- Visual hierarchy (overlays stand out)

---

## Conclusion

This PRD v2.2 represents the **ultimate fusion** of technical excellence and user-centric design. Every decision prioritizes the user's experience while maintaining architectural integrity for long-term scalability.

The document is ready for an elite development team to execute. The phased implementation strategy ensures rapid iteration, continuous testing, and measurable quality gates.

**Let's build the personal OS that users will love.**

---

**Approved By:** Antigravity (Senior AI Architect)  
**Date:** December 6, 2025  
**Status:** Ready for Development
