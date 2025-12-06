-- Create achievements table
create table public.achievements (
  id uuid not null default gen_random_uuid (),
  code text not null,
  title text not null,
  description text not null,
  icon text not null,
  xp_reward integer not null default 0,
  created_at timestamp with time zone not null default now(),
  constraint achievements_pkey primary key (id),
  constraint achievements_code_key unique (code)
);

-- Create user_achievements table
create table public.user_achievements (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  achievement_id uuid not null,
  unlocked_at timestamp with time zone not null default now(),
  constraint user_achievements_pkey primary key (id),
  constraint user_achievements_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint user_achievements_achievement_id_fkey foreign key (achievement_id) references public.achievements (id) on delete cascade,
  constraint user_achievements_user_achievement_unique unique (user_id, achievement_id)
);

-- Create user_scores table
create table public.user_scores (
  user_id uuid not null,
  current_xp integer not null default 0,
  level integer not null default 1,
  life_score integer not null default 0,
  updated_at timestamp with time zone not null default now(),
  constraint user_scores_pkey primary key (user_id),
  constraint user_scores_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- RLS Policies
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.user_scores enable row level security;

-- Achievements are readable by everyone (or authenticated users)
create policy "Achievements are viewable by everyone" on public.achievements for select using (true);

-- User Achievements are viewable by the user
create policy "Users can view their own achievements" on public.user_achievements for select using (auth.uid() = user_id);

-- User Scores are viewable by the user
create policy "Users can view their own scores" on public.user_scores for select using (auth.uid() = user_id);

-- Only system/service role should update these, but for simplicity in this app structure where we use Supabase client:
-- We might need to allow inserts/updates if we do it client-side, but ideally this is done via Edge Functions or strict RLS.
-- For now, assuming the backend (Node.js) uses a service key or the user triggers it via specific flows.
-- Let's allow users to insert/update their own for now to match the current architecture, 
-- but in a real app, this should be more restricted.
create policy "Users can update their own scores" on public.user_scores for all using (auth.uid() = user_id);
create policy "Users can insert their own achievements" on public.user_achievements for insert with check (auth.uid() = user_id);

-- Initial Achievements Data
insert into public.achievements (code, title, description, icon, xp_reward) values
('FIRST_STEP', 'Primeiro Passo', 'Conclua sua primeira tarefa.', 'footprints', 50),
('CONSISTENT', 'Consistente', 'Complete 5 hábitos em um dia.', 'flame', 100),
('JOURNALIST', 'Jornalista', 'Escreva no diário por 3 dias seguidos.', 'book', 150),
('PROJECT_MANAGER', 'Gerente de Projetos', 'Crie um projeto com análise SWOT.', 'briefcase', 200);
