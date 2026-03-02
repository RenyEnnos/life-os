# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## High-Level Architecture

This project appears to be a full-stack JavaScript/TypeScript application with a React frontend (Vite), an Express.js backend (tsx for TypeScript execution), and Supabase for database and authentication. It uses a monorepo-like structure, indicated by separate `client:dev` and `server:dev` scripts.

-   **Frontend**: Built with React and Vite. It utilizes various UI libraries like `@radix-ui`, `tailwind-merge`, and `clsx`. State management seems to be handled with `zustand` and data fetching with `@tanstack/react-query`.
-   **Backend**: An Express.js server running with `tsx` for TypeScript directly. It includes middleware for `cookie-parser`, `cors`, and `helmet`. Authentication likely involves `bcryptjs` and `jsonwebtoken`.
-   **Database/Auth**: Supabase is integrated for database and authentication services, with types generated using `supabase gen types typescript`.
-   **Styling**: Tailwind CSS is used for styling, indicated by `tailwindcss` and `postcss.config.js`.
-   **Testing**: Comprehensive testing setup including `vitest` for unit/integration tests, `playwright` for e2e tests, and Storybook for UI component development.
-   **Deployment**: `vercel.json` suggests deployment to Vercel.

## Common Development Tasks

Here are some common commands you'll use when working on this project:

-   **Install Dependencies**:
    ```bash
    npm install
    ```
-   **Run Development Servers (Frontend & Backend concurrently)**:
    ```bash
    npm run dev
    ```
-   **Run Frontend Development Server**:
    ```bash
    npm run client:dev
    ```
-   **Run Backend Development Server**:
    ```bash
    npm run server:dev
    ```
-   **Build for Production**:
    ```bash
    npm run build
    ```
-   **Lint Code**:
    ```bash
    npm run lint
    ```
-   **Type Check**:
    ```bash
    npm run check
    # or
    npm run typecheck
    ```
-   **Run All Tests**:
    ```bash
    npm run test
    ```
-   **Run Tests in Watch Mode**:
    ```bash
    npm run test:watch
    ```
-   **Run Integration Tests**:
    ```bash
    npm run test:integration
    ```
-   **Run End-to-End (E2E) Tests**:
    ```bash
    npm run test:e2e
    ```
-   **Start Storybook**:
    ```bash
    npm run storybook
    ```
-   **Generate Supabase Types**:
    ```bash
    npm run types:generate
    ```
-   **Run Lighthouse Audit**:
    ```bash
    npm run lh
    ```
-   **Analyze Bundle Size**:
    ```bash
    npm run analyze
    ```
-   **Generate Sitemap and Robots.txt**:
    ```bash
    npm run seo:generate
    ```
