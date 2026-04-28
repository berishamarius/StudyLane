-- Users and profiles
create table profiles (
  id uuid primary key default auth.uid(),
  full_name text,
  email text unique,
  role text default 'student',
  avatar_url text,
  created_at timestamptz default now()
);

create table invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  role text not null default 'student',
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  used_at timestamptz
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher_id uuid references profiles(id),
  teacher_name text,
  description text,
  level text,
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id),
  title text not null,
  description text,
  status text default 'open',
  due_date date,
  assigned_to uuid references profiles(id),
  course_name text,
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  room_name text,
  sender_id uuid references profiles(id),
  message text,
  created_at timestamptz default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  created_at timestamptz default now()
);

create table grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id),
  course_name text,
  value numeric,
  notes text,
  updated_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  title text,
  body text,
  payload jsonb,
  created_at timestamptz default now(),
  read boolean default false
);

-- Policies
alter table profiles enable row level security;
create policy select_profiles on profiles for select using (auth.uid() = id or auth.role() = 'service_role' or auth.role() = 'admin');
create policy insert_profiles on profiles for insert with check (auth.uid() = id or auth.role() = 'service_role');
create policy update_profiles on profiles for update using (auth.uid() = id or auth.role() = 'admin') with check (auth.uid() = id or auth.role() = 'admin');

alter table invite_codes enable row level security;
create policy select_invite_codes on invite_codes for select using (auth.role() = 'service_role' or auth.role() = 'admin');
create policy insert_invite_codes on invite_codes for insert with check (auth.role() = 'service_role' or auth.role() = 'admin');

alter table courses enable row level security;
create policy select_courses on courses for select using (true);
create policy insert_courses on courses for insert with check (auth.role() = 'admin' or auth.role() = 'teacher');
create policy update_courses on courses for update using (auth.role() = 'admin' or auth.role() = 'teacher');

alter table tasks enable row level security;
create policy select_tasks on tasks for select using (true);
create policy insert_tasks on tasks for insert with check (auth.role() = 'admin' or auth.role() = 'teacher');
create policy update_tasks on tasks for update using (auth.role() = 'admin' or auth.role() = 'teacher');

alter table messages enable row level security;
create policy select_messages on messages for select using (true);
create policy insert_messages on messages for insert with check (auth.role() = 'admin' or auth.role() = 'teacher' or auth.role() = 'student');

alter table events enable row level security;
create policy select_events on events for select using (true);
create policy insert_events on events for insert with check (auth.role() = 'admin' or auth.role() = 'teacher');

alter table grades enable row level security;
create policy select_grades on grades for select using (auth.role() = 'admin' or auth.uid() = student_id);
create policy insert_grades on grades for insert with check (auth.role() = 'admin' or auth.role() = 'teacher');
create policy update_grades on grades for update using (auth.role() = 'admin' or auth.uid() = student_id);

alter table notifications enable row level security;
create policy select_notifications on notifications for select using (auth.uid() = profile_id);
create policy insert_notifications on notifications for insert with check (auth.role() = 'service_role' or auth.role() = 'admin' or auth.role() = 'teacher');
