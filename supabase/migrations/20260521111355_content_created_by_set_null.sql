-- When a member account is removed, their content stays in place but
-- with created_by = NULL (rather than blocking the delete). The
-- `organiser` text field on events (and equivalent attribution on
-- other tables) already carries the human-readable owner, so losing
-- the UUID link is acceptable.

DO $$
DECLARE
  rec record;
BEGIN
  FOR rec IN
    SELECT c.conname, c.conrelid::regclass::text AS tbl
    FROM pg_constraint c
    WHERE c.contype = 'f'
      AND c.confrelid = 'auth.users'::regclass
      AND c.conrelid::regclass::text IN (
        'events',
        'community_gardens',
        'supported_gardening',
        'wildlife_gardening_entries',
        'farms',
        'surplus_projects',
        'courses',
        'resources'
      )
      AND c.confdeltype = 'a'  -- only touch NO ACTION ones
  LOOP
    EXECUTE format(
      'ALTER TABLE %s DROP CONSTRAINT %I',
      rec.tbl, rec.conname
    );
    EXECUTE format(
      'ALTER TABLE %s ADD CONSTRAINT %I FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL',
      rec.tbl, rec.conname
    );
  END LOOP;
END $$;
