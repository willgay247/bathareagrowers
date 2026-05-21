-- Capture a free-text "why do you want access?" message at signup so the
-- admin has context for the approval decision. Bio is already used for
-- the public group description.

ALTER TABLE public.member_profiles
  ADD COLUMN applicant_message text;
