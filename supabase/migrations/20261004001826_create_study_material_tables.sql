create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  source_filename text,
  study_content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_study_content_is_object
    check (jsonb_typeof(study_content) = 'object'),
  constraint documents_id_user_id_unique
    unique (id, user_id)
);

create table public.flashcards (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  position integer not null check (position >= 0),
  question text not null check (length(trim(question)) > 0),
  answer text not null check (length(trim(answer)) > 0),
  topic text,
  difficulty text,
  created_at timestamptz not null default now(),
  constraint flashcards_difficulty_valid
    check (difficulty is null or difficulty in ('easy', 'medium', 'hard')),
  constraint flashcards_document_user_fkey
    foreign key (document_id, user_id)
    references public.documents (id, user_id)
    on delete cascade,
  constraint flashcards_document_position_unique
    unique (document_id, position)
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  position integer not null check (position >= 0),
  question text not null check (length(trim(question)) > 0),
  options jsonb not null,
  correct_answer integer not null,
  explanation text not null,
  topic text,
  difficulty text,
  created_at timestamptz not null default now(),
  constraint quiz_questions_options_are_array
    check (
      case
        when jsonb_typeof(options) = 'array'
          then jsonb_array_length(options) >= 2
        else false
      end
    ),
  constraint quiz_questions_correct_answer_in_range
    check (
      case
        when jsonb_typeof(options) = 'array'
          then correct_answer >= 0 and correct_answer < jsonb_array_length(options)
        else false
      end
    ),
  constraint quiz_questions_difficulty_valid
    check (difficulty is null or difficulty in ('easy', 'medium', 'hard')),
  constraint quiz_questions_document_user_fkey
    foreign key (document_id, user_id)
    references public.documents (id, user_id)
    on delete cascade,
  constraint quiz_questions_document_position_unique
    unique (document_id, position)
);

create index documents_user_created_at_idx
  on public.documents (user_id, created_at desc);

create index flashcards_user_document_position_idx
  on public.flashcards (user_id, document_id, position);

create index quiz_questions_user_document_position_idx
  on public.quiz_questions (user_id, document_id, position);

alter table public.documents enable row level security;
alter table public.flashcards enable row level security;
alter table public.quiz_questions enable row level security;

create policy "Users can select their own documents"
  on public.documents
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own documents"
  on public.documents
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own documents"
  on public.documents
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own documents"
  on public.documents
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can select their own flashcards"
  on public.flashcards
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own flashcards"
  on public.flashcards
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own flashcards"
  on public.flashcards
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own flashcards"
  on public.flashcards
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can select their own quiz questions"
  on public.quiz_questions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own quiz questions"
  on public.quiz_questions
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own quiz questions"
  on public.quiz_questions
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own quiz questions"
  on public.quiz_questions
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
