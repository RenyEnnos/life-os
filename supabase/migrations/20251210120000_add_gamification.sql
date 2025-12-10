-- Create user_xp table
create table public.user_xp (
    user_id uuid not null references auth.users(id) on delete cascade primary key,
    total_xp integer not null default 0,
    level integer not null default 1,
    attributes jsonb not null default '{"body": 0, "mind": 0, "spirit": 0, "output": 0}'::jsonb,
    xp_history jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Enable RLS for user_xp
alter table public.user_xp enable row level security;

create policy "Users can view their own xp"
    on public.user_xp for select
    using (auth.uid() = user_id);

create policy "Users can update their own xp" -- In a real app this might be service-role only, but for MVP we allow it
    on public.user_xp for update
    using (auth.uid() = user_id);

create policy "Users can insert their own xp"
    on public.user_xp for insert
    with check (auth.uid() = user_id);


-- Create achievements table
create table public.achievements (
    id uuid not null default gen_random_uuid() primary key,
    slug text not null unique,
    name text not null,
    description text not null,
    icon text not null,
    xp_reward integer not null,
    condition_type text not null, -- 'streak', 'count', 'one_off'
    condition_value integer not null,
    created_at timestamp with time zone not null default now()
);

-- Enable RLS for achievements (Read only for public)
alter table public.achievements enable row level security;

create policy "Achievements are viewable by everyone"
    on public.achievements for select
    using (true);


-- Create user_achievements table
create table public.user_achievements (
    user_id uuid not null references auth.users(id) on delete cascade,
    achievement_id uuid not null references public.achievements(id) on delete cascade,
    unlocked_at timestamp with time zone not null default now(),
    primary key (user_id, achievement_id)
);

-- Enable RLS for user_achievements
alter table public.user_achievements enable row level security;

create policy "Users can view their own achievements"
    on public.user_achievements for select
    using (auth.uid() = user_id);

create policy "Users can insert their own achievements" 
    on public.user_achievements for insert
    with check (auth.uid() = user_id);

-- Create a trigger to update updated_at on user_xp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger on_user_xp_updated
    before update on public.user_xp
    for each row execute procedure public.handle_updated_at();

-- Trigger to initialize user_xp on user creation
create or replace function public.handle_new_user_xp()
returns trigger as $$
begin
    insert into public.user_xp (user_id)
    values (new.id);
    return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created_xp
    after insert on auth.users
    for each row execute procedure public.handle_new_user_xp();
