# Life OS - Product Requirements Document

**Version:** 2.2.0  
**Type:** Personal Operating System (Web Application)  
**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase + Groq AI

---

## 1. Product Overview

Life OS is a personal productivity platform that unifies habits, tasks, finances, university management, and AI assistance into a single cohesive system.

### Core Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Dashboard** | 3-zone layout (Now/Today/Context) with dynamic widgets | P0 |
| **Habits** | Track daily habits with heatmap, streaks, analytics | P0 |
| **Tasks** | Kanban board with Quick Capture and AI parsing | P0 |
| **Finances** | Transaction tracking with charts and AI categorization | P0 |
| **University** | Course management, grade calculator, What-If simulator | P0 |
| **AI Assistant** | Chat interface for insights, planning, and data analysis | P1 |
| **Journal** | Daily reflections and mood tracking | P1 |
| **Gamification** | Points, levels, streaks, and badges | P2 |

---

## 2. User Flows

### 2.1 Authentication

1. User opens application → Login page
2. User enters email/password → Submit
3. Success → Redirect to Dashboard
4. New user → Onboarding flow (5 steps)

### 2.2 Dashboard

1. User sees 3-zone layout:
   - **Zone 1 (Now):** Critical tasks and urgent items
   - **Zone 2 (Today):** Habits for today + daily tasks
   - **Zone 3 (Context):** Finance summary + AI insights
2. User can click habits to mark complete
3. User can use Quick Capture to add tasks/habits/journal entries

### 2.3 Habits

1. User views habit list with checkboxes
2. User clicks checkbox → Habit logged (optimistic update)
3. User views heatmap for long-term consistency
4. User views analytics (streak, completion rate)
5. User can create/edit/delete habits

### 2.4 Tasks

1. User views Kanban board (Todo / In Progress / Done)
2. User drags tasks between columns
3. User can create task with title, description, due date, priority
4. User uses Quick Capture → AI parses input → Preview modal → Confirm

### 2.5 Finances

1. User views transaction table (sortable, filterable)
2. User adds transaction → AI suggests category
3. User views summary cards (balance, daily spend, budget status)
4. User views charts (area, donut, bar)

### 2.6 University

1. User views course cards with current average grade
2. User views assignment Kanban (Todo / Submitted / Graded)
3. User adds grades → System recalculates average
4. User uses What-If simulator to predict outcomes

### 2.7 AI Assistant

1. User clicks FAB (floating action button)
2. Chat interface opens
3. User asks question → AI responds with insights
4. AI can suggest actions (create task, analyze data)
5. User confirms AI action → System executes

---

## 3. Data Models

### 3.1 Users & Profiles

```
profiles {
  id: UUID (PK)
  full_name: string
  avatar_url: string
  points: number (default: 0)
  level: number (default: 1)
  streak_days: number
  settings: JSON
}
```

### 3.2 Habits

```
habits {
  id: UUID (PK)
  user_id: UUID (FK)
  title: string (required)
  description: string
  color: string (hex)
  frequency: string[] (e.g., ["Mon", "Wed", "Fri"])
  time_of_day: "morning" | "afternoon" | "evening"
  is_quantified: boolean
  unit: string (e.g., "pages", "km")
  target_value: number
  icon: string (Lucide icon name)
}

habit_logs {
  id: UUID (PK)
  habit_id: UUID (FK)
  completed_at: date
  value: number (for quantified habits)
  notes: string
}
```

### 3.3 Tasks

```
tasks {
  id: UUID (PK)
  user_id: UUID (FK)
  title: string (required)
  description: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high" | "critical"
  due_date: datetime
  project_id: UUID (optional)
}
```

### 3.4 Transactions

```
transactions {
  id: UUID (PK)
  user_id: UUID (FK)
  amount: number (required)
  type: "income" | "expense"
  category: string (required)
  description: string
  date: date (required)
}
```

### 3.5 University

```
university_courses {
  id: UUID (PK)
  user_id: UUID (FK)
  name: string (required)
  professor: string
  schedule: string
  color: string
  semester: string
}

university_assignments {
  id: UUID (PK)
  course_id: UUID (FK)
  title: string (required)
  type: "exam" | "homework" | "paper" | "project"
  due_date: datetime (required)
  grade: number (nullable)
  weight: number (default: 1.0)
  status: "todo" | "submitted" | "graded"
}
```

### 3.6 Journal

```
journals {
  id: UUID (PK)
  user_id: UUID (FK)
  content: string (required)
  created_at: datetime
}
```

---

## 4. UI Components

### 4.1 Design System

| Component | Variants | States |
|-----------|----------|--------|
| Button | default, outline, ghost, link, glass | hover, active, disabled, loading |
| Input | text, email, number, date | focus, error, disabled |
| Card | default, hover | - |
| Modal | sm, md, lg | open, closed |
| Toast | success, error, info | auto-dismiss |
| Skeleton | - | loading |
| Badge | default, destructive | - |
| Tabs | default | selected |

### 4.2 Layout

- **Shell:** Main layout wrapper
- **Sidebar:** Navigation (collapsible on mobile)
- **Topbar:** Search, profile, settings
- **Content:** Main content area

### 4.3 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, bottom nav |
| Tablet | 768-1023px | 2 columns, side nav |
| Desktop | ≥ 1024px | 3 columns, expanded nav |

---

## 5. API Endpoints

### 5.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/signup | User registration |
| POST | /api/auth/logout | User logout |
| GET | /api/auth/session | Get current session |

### 5.2 Habits

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/habits | List all habits |
| POST | /api/habits | Create habit |
| PUT | /api/habits/:id | Update habit |
| DELETE | /api/habits/:id | Delete habit |
| POST | /api/habits/:id/log | Log habit completion |
| GET | /api/habits/:id/stats | Get habit statistics |

### 5.3 Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | List all tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PATCH | /api/tasks/:id/status | Update task status |

### 5.4 Finances

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | List transactions |
| POST | /api/transactions | Create transaction |
| PUT | /api/transactions/:id | Update transaction |
| DELETE | /api/transactions/:id | Delete transaction |
| GET | /api/transactions/summary | Get summary stats |

### 5.5 University

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/courses | List courses |
| POST | /api/courses | Create course |
| PUT | /api/courses/:id | Update course |
| DELETE | /api/courses/:id | Delete course |
| GET | /api/assignments | List assignments |
| POST | /api/assignments | Create assignment |
| PUT | /api/assignments/:id | Update assignment |
| DELETE | /api/assignments/:id | Delete assignment |

### 5.6 AI Assistant

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/chat | Send message to AI |
| POST | /api/ai/parse | Parse Quick Capture input |
| GET | /api/ai/insights | Get AI-generated insights |

---

## 6. Test Scenarios

### 6.1 Authentication Tests

- [ ] User can login with valid credentials
- [ ] User gets error with invalid credentials
- [ ] User can sign up with new email
- [ ] User cannot sign up with existing email
- [ ] User is redirected after login
- [ ] Session persists after page refresh

### 6.2 Dashboard Tests

- [ ] Dashboard loads with all 3 zones
- [ ] Habits widget shows today's habits
- [ ] Finance widget shows spending summary
- [ ] Quick Capture input accepts text
- [ ] Quick Capture parses and creates task

### 6.3 Habits Tests

- [ ] User can view habit list
- [ ] User can create new habit
- [ ] User can mark habit as complete
- [ ] Completion updates optimistically
- [ ] Heatmap displays correctly
- [ ] Streak counter increments
- [ ] User can edit habit
- [ ] User can delete habit

### 6.4 Tasks Tests

- [ ] User can view Kanban board
- [ ] User can create new task
- [ ] User can drag task between columns
- [ ] Task status updates after drag
- [ ] User can edit task
- [ ] User can delete task
- [ ] Due date filtering works
- [ ] Priority filtering works

### 6.5 Finances Tests

- [ ] User can view transaction table
- [ ] User can add new transaction
- [ ] AI suggests category correctly
- [ ] Summary cards show correct values
- [ ] Charts render with data
- [ ] User can filter by date range
- [ ] User can filter by category
- [ ] User can edit transaction
- [ ] User can delete transaction

### 6.6 University Tests

- [ ] User can view course list
- [ ] User can add new course
- [ ] User can view assignments
- [ ] User can add assignment with grade
- [ ] Average grade calculates correctly
- [ ] What-If simulator shows prediction
- [ ] User can edit course/assignment
- [ ] User can delete course/assignment

### 6.7 AI Assistant Tests

- [ ] FAB opens chat interface
- [ ] User can send message
- [ ] AI responds with relevant answer
- [ ] AI action confirmation works
- [ ] Chat history persists in session

### 6.8 Mobile/Responsive Tests

- [ ] Sidebar collapses on mobile
- [ ] Bottom navigation appears on mobile
- [ ] Cards stack vertically on mobile
- [ ] Touch interactions work correctly
- [ ] Modals are full-screen on mobile

---

## 7. Performance Requirements

| Metric | Target |
|--------|--------|
| UI Interaction | < 50ms |
| Data Operations | < 200ms |
| AI Response | < 2s |
| Lighthouse Score | > 90 |
| Bundle Size (gzipped) | < 500KB |

---

## 8. Accessibility Requirements

- WCAG 2.1 Level AA compliance
- Contrast ratio > 4.5:1
- Keyboard navigation support
- ARIA labels on all interactive elements
- Respects `prefers-reduced-motion`
- Touch targets > 44px × 44px
