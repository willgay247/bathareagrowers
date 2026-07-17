-- Let one organisation hold several pins.
--
-- Some organisations genuinely work more than one plot: Undercliff Urban Farm
-- has two, Bath Mind runs growing sessions at Monksdale Road and Ammerdown
-- House, Bath Community Kitchen serves from two borrowed venues. Until now the
-- table forced a choice between one misleading pin and no pin at all, which is
-- why several of them sat in the "no single site" list despite having sites.
--
-- Each site stays its own row — its own coordinates, note and precision. Rows
-- belonging to the same organisation share a site_group and are numbered, so
-- the page can label them "Site 1 of 2". The total is deliberately NOT stored:
-- it's counted from the group, so it can't drift out of step when a site is
-- added or closed.

ALTER TABLE public.map_locations
  ADD COLUMN site_group text,
  ADD COLUMN site_number integer;

COMMENT ON COLUMN public.map_locations.site_group IS
  'Shared key for rows that are sites of the same organisation. NULL for the '
  'single-site majority.';
COMMENT ON COLUMN public.map_locations.site_number IS
  'Which site this is within site_group, from 1. The total is counted from the '
  'group rather than stored.';

-- A grouped row must say which site it is, and vice versa.
ALTER TABLE public.map_locations
  ADD CONSTRAINT map_locations_site_group_and_number_together CHECK (
    (site_group IS NULL AND site_number IS NULL)
    OR (site_group IS NOT NULL AND site_number IS NOT NULL AND site_number > 0)
  );

-- No two sites in a group can claim the same number.
CREATE UNIQUE INDEX map_locations_site_group_number_idx
  ON public.map_locations (site_group, site_number)
  WHERE site_group IS NOT NULL;

CREATE INDEX map_locations_site_group_idx
  ON public.map_locations (site_group)
  WHERE site_group IS NOT NULL;
