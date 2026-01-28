---
name: testsprite
description: Automated testing with TestSprite MCP. Use when user mentions "testsprite", "generate tests", "test plan", "automated testing", or wants to run E2E/integration tests via TestSprite.
---

# TestSprite MCP Integration

TestSprite is an AI-powered test generation and execution tool. It uses MCP (Model Context Protocol) to integrate with the agent.

## When to Use This Skill

- User asks to generate tests automatically
- User mentions "testsprite" or "test plan"
- User wants to create a PRD from code
- User wants to run automated E2E tests

## Prerequisites

Before using any TestSprite tool, you MUST:

1. **Identify Project Path**: Absolute path to project root
2. **Identify Local Port**: Check `vite.config.ts`, `package.json`, or framework defaults
3. **Identify Project Type**: `frontend` (React, Vue, Next.js) or `backend` (Express, NestJS, API)
4. **Identify Test Scope**: `codebase` (full) or `diff` (staged changes only)

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  1. BOOTSTRAP (Required First)                              │
│     testsprite_bootstrap                                    │
│     → Sets up TestSprite for the project                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│  2. ANALYSIS (Optional but Recommended)                     │
│     testsprite_generate_code_summary                        │
│     → Analyzes and summarizes the codebase                  │
│                                                             │
│     testsprite_generate_standardized_prd                    │
│     → Generates PRD from code (if no PRD exists)            │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│  3. PLAN GENERATION                                         │
│     testsprite_generate_frontend_test_plan                  │
│     → For frontend projects                                 │
│                                                             │
│     testsprite_generate_backend_test_plan                   │
│     → For backend projects                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│  4. EXECUTION                                               │
│     testsprite_generate_code_and_execute                    │
│     → Generates test code, runs tests, saves report         │
│                                                             │
│     testsprite_rerun_tests                                  │
│     → Re-runs tests manually when needed                    │
└─────────────────────────────────────────────────────────────┘
```

## Tool Reference

### 1. `testsprite_bootstrap`

**Purpose**: Initialize TestSprite for a project. MUST be called first.

| Parameter     | Type    | Required | Description                                       |
| ------------- | ------- | -------- | ------------------------------------------------- |
| `projectPath` | string  | ✅       | Absolute path to project root                     |
| `localPort`   | number  | ✅       | Dev server port (Vite: 5173, Next: 3000, etc.)    |
| `type`        | string  | ✅       | `frontend` or `backend`                           |
| `testScope`   | string  | ✅       | `codebase` (all) or `diff` (staged changes)       |
| `pathname`    | string  | ❌       | Specific page path (e.g., `/dashboard`)           |

**Port Detection Heuristics**:
- **Vite/React**: 5173 (default), check `vite.config.ts` for custom port
- **Next.js**: 3000 (default)
- **Express**: Check `server.ts` or `.env` for `PORT`
- **Storybook**: 6006

---

### 2. `testsprite_generate_code_summary`

**Purpose**: Analyze repository and create codebase summary.

| Parameter         | Type   | Required | Description                   |
| ----------------- | ------ | -------- | ----------------------------- |
| `projectRootPath` | string | ✅       | Absolute path to project root |

**Use When**: Starting with an unfamiliar codebase or before generating tests.

---

### 3. `testsprite_generate_standardized_prd`

**Purpose**: Generate a structured PRD from the codebase.

| Parameter     | Type   | Required | Description                   |
| ------------- | ------ | -------- | ----------------------------- |
| `projectPath` | string | ✅       | Absolute path to project root |

**Use When**: No PRD exists or need to document current functionality.

---

### 4. `testsprite_generate_frontend_test_plan`

**Purpose**: Generate test plan for frontend applications.

| Parameter     | Type    | Required | Default | Description                    |
| ------------- | ------- | -------- | ------- | ------------------------------ |
| `projectPath` | string  | ✅       | -       | Absolute path to project root  |
| `needLogin`   | boolean | ✅       | `true`  | Include login flow in tests    |

**Use When**: Testing React, Vue, Next.js, or any frontend app.

---

### 5. `testsprite_generate_backend_test_plan`

**Purpose**: Generate test plan for backend/API applications.

| Parameter     | Type   | Required | Description                   |
| ------------- | ------ | -------- | ----------------------------- |
| `projectPath` | string | ✅       | Absolute path to project root |

**Use When**: Testing Express, NestJS, or API endpoints.

---

### 6. `testsprite_generate_code_and_execute`

**Purpose**: Generate test code, execute tests, and save markdown report.

| Parameter               | Type     | Required | Default | Description                              |
| ----------------------- | -------- | -------- | ------- | ---------------------------------------- |
| `projectPath`           | string   | ✅       | -       | Absolute path to project root            |
| `projectName`           | string   | ✅       | -       | Name of root directory                   |
| `testIds`               | string[] | ❌       | `[]`    | Specific test IDs (empty = all tests)    |
| `additionalInstruction` | string   | ❌       | `""`    | Extra instructions for test generation   |

**Use When**: Ready to generate and run actual tests.

---

### 7. `testsprite_rerun_tests`

**Purpose**: Re-run previously generated tests.

| Parameter     | Type   | Required | Description                   |
| ------------- | ------ | -------- | ----------------------------- |
| `projectPath` | string | ✅       | Absolute path to project root |

**Use When**: Tests were modified or need to verify fixes.

---

## Quick Start Examples

### Frontend Project (Vite/React)

```
1. Bootstrap:
   - projectPath: "c:/Users/user/my-app"
   - localPort: 5173
   - type: "frontend"
   - testScope: "codebase"

2. Generate Test Plan:
   - projectPath: "c:/Users/user/my-app"
   - needLogin: true

3. Execute Tests:
   - projectPath: "c:/Users/user/my-app"
   - projectName: "my-app"
   - testIds: []
   - additionalInstruction: ""
```

### Backend Project (Express)

```
1. Bootstrap:
   - projectPath: "c:/Users/user/api-server"
   - localPort: 3001
   - type: "backend"
   - testScope: "codebase"

2. Generate Test Plan:
   - projectPath: "c:/Users/user/api-server"

3. Execute Tests:
   - projectPath: "c:/Users/user/api-server"
   - projectName: "api-server"
   - testIds: []
   - additionalInstruction: "Focus on authentication endpoints"
```

## Checklist

Use this checklist when running TestSprite:

```markdown
- [ ] Identified project path
- [ ] Identified dev server port
- [ ] Identified project type (frontend/backend)
- [ ] Dev server is running (or will be started)
- [ ] Bootstrapped TestSprite
- [ ] Generated test plan
- [ ] Executed tests
- [ ] Reviewed test report
```

## Troubleshooting

| Issue                    | Solution                                           |
| ------------------------ | -------------------------------------------------- |
| Bootstrap fails          | Check if project path exists and is accessible     |
| Port not found           | Look for `PORT` in `.env` or config files          |
| Tests fail to start      | Ensure dev server is running on specified port     |
| Login tests skip         | Set `needLogin: true` in frontend test plan        |
