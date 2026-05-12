-- Enable moddatetime extension if available (PostgreSQL natively supports triggers, but Supabase provides moddatetime)
create extension if not exists moddatetime schema extensions;

-- Projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  idea_raw text not null,
  idea_refined text,
  plan jsonb,
  tech_stack jsonb,
  constraints jsonb,
  status text not null default 'idea',
  github_repo text,
  vercel_project_id text,
  github_token_encrypted text,
  vercel_token_encrypted text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Tasks table
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  sequence_number integer not null,
  title text not null,
  description text not null,
  acceptance_criteria text[] not null,
  file_paths text[] not null,
  dependencies text[] default '{}',
  generated_prompt text,
  generated_code jsonb,
  review_result jsonb,
  status text not null default 'pending',
  retry_count integer default 0 not null,
  github_commit_sha text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Conversations table (storing AI/User interactions for context)
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  phase text not null, -- e.g., 'analysis', 'planning'
  role text not null, -- 'user', 'assistant'
  content text not null,
  created_at timestamp with time zone default now() not null
);

-- Task comments table
create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_question text not null,
  ai_answer text not null,
  created_at timestamp with time zone default now() not null
);

-- RLS Policies (example - basic user isolation)
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.conversations enable row level security;
alter table public.task_comments enable row level security;

create policy "Users can only access their own projects"
  on public.projects for all
  using (user_id = auth.uid()::text);

create policy "Users can only access tasks of their own projects"
  on public.tasks for all
  using (project_id in (select id from public.projects where user_id = auth.uid()::text));

create policy "Users can only access conversations of their own projects"
  on public.conversations for all
  using (project_id in (select id from public.projects where user_id = auth.uid()::text));

create policy "Users can only access task comments"
  on public.task_comments for all
  using (task_id in (select id from public.tasks where project_id in (select id from public.projects where user_id = auth.uid()::text)));

-- Update triggers
create trigger handle_updated_at_projects before update on public.projects
  for each row execute procedure moddatetime (updated_at);

create trigger handle_updated_at_tasks before update on public.tasks
  for each row execute procedure moddatetime (updated_at);
