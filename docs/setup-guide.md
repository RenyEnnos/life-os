# Life OS - Developer Setup Guide

To safely install and run the Life OS Personal Operating System framework on your local setup, ensure you fulfill all environment requirements below.

## 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Supabase**: Active CLI instance or Cloud project credentials

## 2. Environment Variables (`.env`)
Life OS needs specific configuration keys populated. Create a `.env` in the root of your project:

```bash
# SUPABASE CONNECTION (Required)
VITE_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhb...[ANON_KEY]"

# BACKEND JWT (Required)
JWT_SECRET="generate-a-safe-random-32-char-string"

# SENTRY TRACKING (Optional)
VITE_SENTRY_DSN=""

# ENVIRONMENT
NODE_ENV="development"
PORT=3000
```
*Note: Make sure your `JWT_SECRET` is strong to correctly sign `authenticateToken` checks.*

## 3. Installation Flow

```bash
# 1. Clone the repository
git clone https://github.com/RenyEnnos/life-os.git
cd life-os

# 2. Install NPM Dependencies
npm install

# 3. Pull Supabase Local Types (If using CLI)
# npx supabase status
# npx supabase types typescript --local > src/shared/types/database.ts

# 4. Start concurrent processes (API + Vite Frontend)
npm run dev
```

The Application UI will mount on `http://localhost:5173` while the backend Express server will expose the REST interface at `http://localhost:3000/api`.

## 4. API Documentation (Swagger)
While running in `development`, Life OS will auto-generate an OpenAPI spec map.
Navigate to [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs) to interactively test endpoints (Auth, Tasks, Habits, Templates).

## 5. UI Components Guide (Storybook)
Life OS ships a design-system dictionary via Storybook. 
If modifying the React UI, you can iterate components in isolation via:

```bash
npm run storybook
```
This runs the design portal on port `6006`.
