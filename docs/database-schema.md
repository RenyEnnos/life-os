# Life OS - Database Schema

A arquitetura de dados do Life OS foi projetada utilizando **PostgreSQL** administrada pelo Supabase. O sistema é fundamentado no `user_id` servindo como Tenant-Identifier, garantindo Row Level Security (RLS) isolando registros por conta.

## Diagrama Entidade Referência

Abaixo encontra-se a modelagem abstrata em visualização Entity-Relationship.

```mermaid
erDiagram
    USERS ||--o{ HABITS : "tracks"
    USERS ||--o{ TASKS : "creates"
    USERS ||--o{ JOURNAL_ENTRIES : "writes"
    USERS ||--o{ FINANCE_TRANSACTIONS : "logs"
    USERS ||--o{ FINANCE_CATEGORIES : "organizes"
    USERS ||--o{ DAILY_LOGS : "logs"
    USERS ||--o{ AUTH_LOGS : "generates"
    USERS ||--o{ ONBOARDING_PROGRESS : "completes"
    USERS ||--o{ TEMPLATE_USAGE_LOGS : "installs"

    USERS {
        uuid id PK
        string email
        string password_hash
        string name
        jsonb preferences
        string theme
        timestamp created_at
        timestamp updated_at
    }

    HABITS {
        uuid id PK
        uuid user_id FK
        string name
        string description
        string[] frequency
        string category
        integer streak
        timestamp last_completed
        string color
        string time_of_day
    }

    TASKS {
        uuid id PK
        uuid user_id FK
        string title
        string description
        string status "todo, in_progress, done"
        string priority "low, medium, high"
        string[] tags
        timestamp due_date
    }

    JOURNAL_ENTRIES {
        uuid id PK
        uuid user_id FK
        string title
        text content
        integer mood_score
        string[] tags
        timestamp date
    }

    FINANCE_TRANSACTIONS {
        uuid id PK
        uuid user_id FK
        number amount
        string type "income, expense"
        uuid category_id FK
        string description
        timestamp date
    }

    ONBOARDING_PROGRESS {
        uuid id PK
        uuid user_id FK
        string current_step "welcome, focus, templates..."
        jsonb steps_completed
        boolean completed
        boolean skipped
        timestamp created_at
    }
```

## Security Model (RLS)
Todas as tabelas críticas possuem políticas RLS (Row Level Security) ativadas na interface do Supabase garantindo que `auth.uid() = user_id`. Nenhuma tabela acima é acessível para leitura ou gravação anônima desprotegida.
