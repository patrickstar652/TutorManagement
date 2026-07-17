-- Replace the original one-row-per-class-member payment model with
-- immutable billing-period snapshots. Existing payment rows are test data
-- and are intentionally reset as part of this migration.

drop table if exists public.payments;
drop table if exists public.billing_periods;

create extension if not exists btree_gist with schema extensions;

create table public.billing_periods (
  id bigint generated always as identity primary key,
  schedule_id integer not null
    references public.schedule(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  lesson_count integer not null,
  unit_price bigint not null,
  amount_per_student bigint generated always as (
    lesson_count::bigint * unit_price
  ) stored,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp,
  constraint billing_periods_date_range_check
    check (period_end >= period_start),
  constraint billing_periods_lesson_count_check
    check (lesson_count > 0),
  constraint billing_periods_unit_price_check
    check (unit_price >= 0),
  constraint billing_periods_schedule_dates_key
    unique (schedule_id, period_start, period_end),
  constraint billing_periods_no_overlap
    exclude using gist (
      schedule_id with =,
      daterange(period_start, period_end, '[]') with &&
    )
);

create index billing_periods_schedule_start_idx
  on public.billing_periods (schedule_id, period_start desc, id desc);

create table public.payments (
  id bigint generated always as identity primary key,
  billing_period_id bigint not null
    references public.billing_periods(id) on delete cascade,
  student_id integer not null
    references public.students(id) on delete restrict,
  student_name text not null,
  amount_due bigint not null,
  status text not null default '未繳',
  paid_at timestamptz,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp,
  constraint payments_period_student_key
    unique (billing_period_id, student_id),
  constraint payments_student_name_not_blank
    check (btrim(student_name) <> ''),
  constraint payments_amount_due_check
    check (amount_due >= 0),
  constraint payments_status_check
    check (status in ('已繳', '未繳')),
  constraint payments_paid_at_check
    check (
      (status = '已繳' and paid_at is not null)
      or (status = '未繳' and paid_at is null)
    )
);

create index payments_student_id_idx
  on public.payments (student_id);

create index payments_period_status_idx
  on public.payments (billing_period_id, status);

alter table public.billing_periods enable row level security;
alter table public.payments enable row level security;

-- TutorFlow accesses these tables through its authenticated Express server,
-- not through Supabase's generated Data API.
revoke all on table public.billing_periods from anon, authenticated;
revoke all on table public.payments from anon, authenticated;
revoke all on sequence public.billing_periods_id_seq from anon, authenticated;
revoke all on sequence public.payments_id_seq from anon, authenticated;
