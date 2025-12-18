-- Symbiosis links between tasks (Fluxo) and habits (Health)
create table if not exists task_habit_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  task_id uuid references tasks(id) on delete cascade,
  habit_id uuid references habits(id) on delete cascade,
  impact_vital integer not null default 0 check (impact_vital between -5 and 5),
  custo_financeiro numeric(12,2) default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- RLS
alter table task_habit_links enable row level security;

create policy "Users can view own symbiosis links"
  on task_habit_links for select
  using (auth.uid() = user_id and deleted_at is null);

create policy "Users can insert own symbiosis links"
  on task_habit_links for insert
  with check (auth.uid() = user_id);

create policy "Users can update own symbiosis links"
  on task_habit_links for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can soft delete own symbiosis links"
  on task_habit_links for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_task_habit_links_user on task_habit_links(user_id);
create index if not exists idx_task_habit_links_task on task_habit_links(task_id);
create index if not exists idx_task_habit_links_habit on task_habit_links(habit_id);
