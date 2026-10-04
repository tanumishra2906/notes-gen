create or replace function public.replace_flashcards(
  p_document_id uuid,
  p_cards jsonb
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Authentication is required to replace flashcards.'
      using errcode = '42501';
  end if;

  if p_cards is null or jsonb_typeof(p_cards) <> 'array' then
    raise exception 'Flashcards must be provided as a JSON array.'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.documents as document
    where document.id = p_document_id
      and document.user_id = v_user_id
  ) then
    raise exception 'Document not found or not owned by the authenticated user.'
      using errcode = '42501';
  end if;

  delete from public.flashcards
  where document_id = p_document_id
    and user_id = v_user_id;

  insert into public.flashcards (
    document_id,
    user_id,
    position,
    question,
    answer,
    topic,
    difficulty
  )
  select
    p_document_id,
    v_user_id,
    (card.ordinality - 1)::integer,
    card.item ->> 'question',
    card.item ->> 'answer',
    card.item ->> 'topic',
    card.item ->> 'difficulty'
  from jsonb_array_elements(p_cards) with ordinality as card(item, ordinality);
end;
$$;

create or replace function public.replace_quiz_questions(
  p_document_id uuid,
  p_questions jsonb
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Authentication is required to replace quiz questions.'
      using errcode = '42501';
  end if;

  if p_questions is null or jsonb_typeof(p_questions) <> 'array' then
    raise exception 'Quiz questions must be provided as a JSON array.'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.documents as document
    where document.id = p_document_id
      and document.user_id = v_user_id
  ) then
    raise exception 'Document not found or not owned by the authenticated user.'
      using errcode = '42501';
  end if;

  delete from public.quiz_questions
  where document_id = p_document_id
    and user_id = v_user_id;

  insert into public.quiz_questions (
    document_id,
    user_id,
    position,
    question,
    options,
    correct_answer,
    explanation,
    topic,
    difficulty
  )
  select
    p_document_id,
    v_user_id,
    (question.ordinality - 1)::integer,
    question.item ->> 'question',
    question.item -> 'options',
    (question.item ->> 'correctAnswer')::integer,
    question.item ->> 'explanation',
    question.item ->> 'topic',
    question.item ->> 'difficulty'
  from jsonb_array_elements(p_questions) with ordinality as question(item, ordinality);
end;
$$;

revoke all on function public.replace_flashcards(uuid, jsonb) from public;
revoke all on function public.replace_flashcards(uuid, jsonb) from anon;
grant execute on function public.replace_flashcards(uuid, jsonb) to authenticated;

revoke all on function public.replace_quiz_questions(uuid, jsonb) from public;
revoke all on function public.replace_quiz_questions(uuid, jsonb) from anon;
grant execute on function public.replace_quiz_questions(uuid, jsonb) to authenticated;
