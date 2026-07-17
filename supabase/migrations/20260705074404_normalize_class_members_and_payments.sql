begin;

-- Normalize payment field values before tightening constraints.
update payments
set amount = coalesce(amount, 0),
    status = case
      when status in ('已繳', 'paid', 'PAID', 'Paid') then '已繳'
      when status in ('未繳', 'unpaid', 'UNPAID', 'Unpaid') then '未繳'
      when status is null or btrim(status::text) = '' then '未繳'
      else status
    end,
    created_at = coalesce(created_at, current_timestamp);

alter table payments
  alter column amount set default 0,
  alter column amount set not null,
  alter column status set default '未繳',
  alter column status set not null,
  alter column created_at set default current_timestamp,
  alter column created_at set not null;

alter table payments
  alter column created_at type timestamptz using created_at at time zone 'UTC';

alter table payments
  add column if not exists updated_at timestamptz not null default current_timestamp;

alter table payments
  drop constraint if exists payments_amount_nonnegative,
  add constraint payments_amount_nonnegative check (amount >= 0),
  drop constraint if exists payments_status_check,
  add constraint payments_status_check check (status in ('已繳', '未繳'));

-- payments.schedule_id currently points at class(id); it represents schedule(id) in the app.
alter table payments drop constraint if exists payments_schedule_id_fkey;
alter table payments
  add constraint payments_schedule_id_fkey
  foreign key (schedule_id) references schedule(id) on delete cascade;

-- One class per schedule.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'class_schedule_id_key'
  ) then
    alter table class add constraint class_schedule_id_key unique (schedule_id);
  end if;
end $$;

-- Normalized student roster and class seat assignment tables.
create table if not exists students (
  id serial primary key,
  user_id integer not null references users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp,
  constraint students_name_not_blank check (btrim(name) <> ''),
  constraint students_user_name_key unique (user_id, name)
);

create table if not exists class_members (
  id serial primary key,
  class_id integer not null references class(id) on delete cascade,
  student_id integer not null references students(id) on delete cascade,
  seat_id text not null,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp,
  constraint class_members_seat_id_not_blank check (btrim(seat_id) <> ''),
  constraint class_members_class_seat_key unique (class_id, seat_id),
  constraint class_members_class_student_key unique (class_id, student_id)
);

with parsed_members as (
  select
    c.id as class_id,
    c.user_id,
    btrim(split_part(member_value, ':', 1)) as seat_id,
    nullif(btrim(substr(member_value, strpos(member_value, ':') + 1)), '') as student_name
  from class c
  cross join lateral unnest(coalesce(c.members, array[]::text[])) as member_value
  where strpos(member_value, ':') > 0
), valid_members as (
  select distinct class_id, user_id, seat_id, student_name
  from parsed_members
  where seat_id <> '' and student_name is not null
)
insert into students (user_id, name)
select distinct user_id, student_name
from valid_members
on conflict (user_id, name) do nothing;

with parsed_members as (
  select
    c.id as class_id,
    c.user_id,
    btrim(split_part(member_value, ':', 1)) as seat_id,
    nullif(btrim(substr(member_value, strpos(member_value, ':') + 1)), '') as student_name
  from class c
  cross join lateral unnest(coalesce(c.members, array[]::text[])) as member_value
  where strpos(member_value, ':') > 0
), valid_members as (
  select distinct class_id, user_id, seat_id, student_name
  from parsed_members
  where seat_id <> '' and student_name is not null
)
insert into class_members (class_id, student_id, seat_id)
select vm.class_id, s.id, vm.seat_id
from valid_members vm
join students s on s.user_id = vm.user_id and s.name = vm.student_name
on conflict (class_id, seat_id) do update
set student_id = excluded.student_id,
    updated_at = current_timestamp;

alter table payments add column if not exists class_member_id integer;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'payments_class_member_id_fkey'
  ) then
    alter table payments
      add constraint payments_class_member_id_fkey
      foreign key (class_member_id) references class_members(id) on delete set null;
  end if;
end $$;

with ranked_payments as (
  select
    p.id,
    cm.id as class_member_id,
    row_number() over (partition by cm.id order by p.updated_at desc, p.created_at desc, p.id desc) as rn
  from payments p
  join class c on c.schedule_id = p.schedule_id
  join students s on s.user_id = c.user_id and s.name = p.student_name
  join class_members cm on cm.class_id = c.id and cm.student_id = s.id
)
update payments p
set class_member_id = rp.class_member_id,
    updated_at = current_timestamp
from ranked_payments rp
where p.id = rp.id
  and rp.rn = 1;

create unique index if not exists payments_class_member_id_key
  on payments (class_member_id)
  where class_member_id is not null;

create index if not exists schedule_user_weekday_start_idx on schedule (user_id, weekday, start_time);
create index if not exists class_user_id_idx on class (user_id);
create index if not exists class_schedule_id_idx on class (schedule_id);
create index if not exists reminders_user_schedule_remind_at_idx on reminders (user_id, schedule_id, remind_at);
create index if not exists payments_schedule_status_idx on payments (schedule_id, status);
create index if not exists payments_class_member_id_idx on payments (class_member_id);
create index if not exists students_user_id_idx on students (user_id);
create index if not exists class_members_student_id_idx on class_members (student_id);

commit;;
