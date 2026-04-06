# Life OS (Electron Desktop - Offline First)

Life OS é uma plataforma completa de produtividade e gerenciamento pessoal, arquitetada como um aplicativo desktop **offline-first** usando Electron.

## Arquitetura Visionária 🚀

O projeto foi completamente migrado para uma arquitetura **desktop-first e offline-first**:

1. **Electron Main Process:** Atua como nosso "Backend" local.
2. **SQLite Local (`better-sqlite3`):** Todos os dados são armazenados localmente no disco para uso desktop de baixa latência.
3. **Comunicação IPC:** O frontend React se comunica diretamente com o banco de dados local via Electron IPC (`window.api`).
4. **Sincronização Opcional:** Uma camada de sincronização com Supabase existe em `electron/sync/engine.ts`, mas depende de configuração explícita e não deve ser tratada como comportamento padrão do MVP.
5. **Expectativa de Runtime MVP:** O Life OS é primariamente um aplicativo desktop **offline-first**. A sincronização com a nuvem só está disponível quando explicitamente configurada e validada.

## Setup & Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <repository-url>
    cd life-os
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # Dependências nativas como better-sqlite3 serão compiladas para sua plataforma
    ```

3.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz apenas se precisar de autenticação Supabase ou quiser validar a sincronização desktop:
    ```env
    VITE_SUPABASE_URL=sua_supabase_url
    VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
    ```
    Para o MVP atual, o uso desktop offline é o comportamento padrão e esperado.

4.  **Execute o aplicativo Desktop:**
    ```bash
    npm run dev
    ```

## Desenvolvimento

- `src/features/*`: Contém features React que buscam dados via `window.api`.
- `electron/main.ts`: Entry point do processo principal.
- `electron/db/database.ts`: Schema e setup do SQLite.
- `electron/sync/engine.ts`: Sincronização background com Supabase (opcional).
- `electron/ipc/*`: Handlers IPC para o frontend.

## Licença
MIT
