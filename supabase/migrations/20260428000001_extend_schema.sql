-- ============================================================
-- Migration: extend schema
-- Adds missing tables, indexes, auth trigger, and policy fixes
-- ============================================================

-- Auto-create a profile row whenever a new auth user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Add used_by column to invite_codes (was missing)
alter table invite_codes
  add column if not exists used_by uuid references profiles(id);

-- ── study_preferences ─────────────────────────────────────
create table if not exists study_preferences (
  user_id    uuid primary key references profiles(id) on delete cascade,
  study_mode text not null default 'school' check (study_mode in ('school', 'university')),
  institution text,
  level       text,
  updated_at  timestamptz default now()
);

alter table study_preferences enable row level security;

create policy sp_select on study_preferences
  for select using (auth.uid() = user_id);
create policy sp_insert on study_preferences
  for insert with check (auth.uid() = user_id or (auth.jwt()->>'role') = 'service_role');
create policy sp_update on study_preferences
  for update using (auth.uid() = user_id or (auth.jwt()->>'role') = 'service_role');

-- ── files ─────────────────────────────────────────────────
create table if not exists files (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  storage_path text not null,
  mime_type   text,
  size_bytes  bigint,
  uploaded_by uuid references profiles(id),
  course_id   uuid references courses(id),
  created_at  timestamptz default now()
);

alter table files enable row level security;

create policy files_select on files
  for select using (true);
create policy files_insert on files
  for insert with check (auth.uid() = uploaded_by);
create policy files_delete on files
  for delete using (
    auth.uid() = uploaded_by
    or (auth.jwt()->'user_metadata'->>'role') = 'admin'
  );

-- ── schedules ─────────────────────────────────────────────
create table if not exists schedules (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references profiles(id) on delete cascade,
  course_id   uuid references courses(id),
  subject     text not null,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0 = Sunday
  start_time  time not null,
  end_time    time not null,
  location    text,
  type        text default 'Lesson',
  created_at  timestamptz default now()
);

alter table schedules enable row level security;

create policy sched_select on schedules
  for select using (auth.uid() = profile_id);
create policy sched_insert on schedules
  for insert with check (auth.uid() = profile_id);
create policy sched_update on schedules
  for update using (auth.uid() = profile_id);
create policy sched_delete on schedules
  for delete using (auth.uid() = profile_id);

-- ── learning_rooms ────────────────────────────────────────
create table if not exists learning_rooms (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  best_for    text,
  capacity    int,
  status      text default 'Open' check (status in ('Open', 'Booked', 'Closed')),
  created_by  uuid references profiles(id),
  created_at  timestamptz default now()
);

alter table learning_rooms enable row level security;

create policy rooms_select on learning_rooms
  for select using (true);
create policy rooms_insert on learning_rooms
  for insert with check (
    (auth.jwt()->'user_metadata'->>'role') in ('admin', 'teacher')
  );
create policy rooms_update on learning_rooms
  for update using (
    (auth.jwt()->'user_metadata'->>'role') in ('admin', 'teacher')
  );
create policy rooms_delete on learning_rooms
  for delete using (
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  );

-- ── Performance indexes ────────────────────────────────────
create index if not exists idx_tasks_assigned_to    on tasks(assigned_to);
create index if not exists idx_tasks_due_date        on tasks(due_date);
create index if not exists idx_tasks_status          on tasks(status);
create index if not exists idx_messages_room         on messages(room_name);
create index if not exists idx_messages_created_at   on messages(created_at desc);
create index if not exists idx_grades_student_id     on grades(student_id);
create index if not exists idx_notifications_profile on notifications(profile_id);
create index if not exists idx_notifications_read    on notifications(profile_id, read) where read = false;
create index if not exists idx_files_course_id       on files(course_id);
create index if not exists idx_schedules_profile_day on schedules(profile_id, day_of_week);
create index if not exists idx_events_starts_at      on events(starts_at);
