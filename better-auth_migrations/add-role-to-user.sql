alter table "user" add column if not exists "role" text not null default 'customer';
