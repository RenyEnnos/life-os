# Database Schema v2 - Life OS Core

## Overview
This document describes the core tables for the Life OS platform, focused on productivity, habits, and finances.

## Core Tables

### 1. `habits`
Tracks recurring user habits.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> auth.users)
- `name`: TEXT (Required)
- `description`: TEXT
- `target_value`: INTEGER (Default: 1)
- `frequency`: TEXT (Daily, Weekly, Monthly)
- `created_at`: TIMESTAMP

### 2. `habit_logs`
Records completion of habits.
- `id`: UUID (Primary Key)
- `habit_id`: UUID (Foreign Key -> habits)
- `logged_date`: DATE (Required)
- `value`: INTEGER (Default: 1)

### 3. `tasks` (Kanban)
Management of one-off or recurring tasks.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> auth.users)
- `title`: TEXT (Required)
- `description`: TEXT
- `status`: TEXT (Todo, In Progress, Done)
- `priority`: INTEGER (0-3)
- `due_date`: TIMESTAMP

### 4. `transactions`
Financial tracking.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> auth.users)
- `category_id`: UUID (Foreign Key -> finance_categories)
- `description`: TEXT
- `amount`: DECIMAL (Required)
- `transaction_date`: DATE (Required)
- `type`: TEXT (Income, Expense)

### 5. `finance_categories`
Classification for transactions.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> auth.users)
- `name`: TEXT (Required)
- `type`: TEXT (Income, Expense)
- `icon`: TEXT

---
*Updated: 2026-03-02*
