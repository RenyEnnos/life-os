# Life OS

Life OS is a comprehensive personal productivity and management application designed to help you organize your life, track your habits, manage your finances, and achieve your goals.

## Features

- **Dashboard**: Overview of your daily progress, tasks, and health metrics.
- **Habits**: Track daily habits with morning, afternoon, and evening routines.
- **Tasks**: Manage tasks with due dates, priorities, and AI-generated weekly plans.
- **Journal**: Daily journaling with AI-generated summaries.
- **Finances**: Track income and expenses with visual charts and AI tag suggestions.
- **Health**: Monitor health metrics and medication reminders.
- **Projects**: Manage projects and perform AI-powered SWOT analysis.
- **Rewards**: Gamify your life with a scoring system and achievements.
- **AI Integration**: Powered by Groq for intelligent suggestions and summaries.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **State Management**: React Query, Zustand
- **Routing**: React Router
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: Node.js, Express (or Supabase Edge Functions)
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq SDK

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd life-os
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory with the following variables:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    GROQ_API_KEY=your_groq_api_key
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

## Scripts

- `pnpm dev`: Start the development server.
- `pnpm build`: Build the application for production.
- `pnpm preview`: Preview the production build.
- `pnpm test`: Run tests using Vitest.

## Architecture

The project follows a feature-based architecture:
- `src/features/*`: Contains all feature-specific logic (components, hooks, types).
- `src/components/ui`: Shared UI components (Button, Card, Input, etc.).
- `src/lib`: Utility functions and configurations (api, supabase, utils).
- `src/contexts`: Global contexts (AuthContext).
- `src/hooks`: Shared hooks (useAI).

## License

MIT
