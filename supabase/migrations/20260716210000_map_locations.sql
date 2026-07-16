-- Map of growing / horticultural / food projects across Bath & North East Somerset.
-- Backs the /locations/map page.
--
-- This is a standalone table rather than lat/lng columns bolted onto the five
-- CMS tables: only 26 of the ~65 organisations on the map have a CMS row, and
-- the CMS tables disagree on column names (name/title, bio/description,
-- external_link/link/volunteering_link). source_table + source_id keep the link
-- back to a CMS row where one exists.
--
-- PRIVACY RULE, load-bearing: rows whose only known address is someone's home
-- are stored with address/postcode/latitude/longitude ALL NULL and
-- unmapped_reason = 'privacy_hold'. The anon key can read this table, so a
-- private address must never be written into it. Chase consent first; only then
-- fill the address in.

CREATE TABLE public.map_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  summary text,
  area text,

  address text,
  postcode text,
  latitude double precision,
  longitude double precision,

  -- G/R/D/C on the printed B&NES map
  categories text[] NOT NULL DEFAULT '{}',
  org_type text CHECK (org_type IN ('charity','cic','community','commercial')),

  -- 'mapped'   = has coordinates, draws a pin
  -- 'unmapped' = listed on the page but deliberately not pinned; see unmapped_reason
  status text NOT NULL DEFAULT 'unmapped' CHECK (status IN ('mapped','unmapped')),
  unmapped_reason text CHECK (unmapped_reason IN (
    'district_wide',    -- operates across the whole district; no single site (Cropdrop, Avon Gleaning)
    'no_single_site',   -- umbrella/network org with no growing site of its own (Transition Bath)
    'not_published',    -- has a site, but no address is published anywhere
    'privacy_hold'      -- address known but it is a private home; needs consent before publishing
  )),

  -- 'exact'  = from the organisation's own published address/coordinates
  -- 'approx' = third-party directory, host site, or postcode centroid
  pin_precision text CHECK (pin_precision IN ('exact','approx')),
  location_note text,  -- "appointment only", "pin is the adjoining car park", etc.
  source_url text,     -- where the address came from, so it can be re-checked

  external_link text,
  image_url text,
  council_ref integer, -- number on the printed "Grown in Bath and NES" map

  source_table text CHECK (source_table IN (
    'community_gardens','farms','supported_gardening',
    'wildlife_gardening_entries','surplus_projects'
  )),
  source_id uuid,

  hidden boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- A pin must have coordinates; anything without them must say why.
  CONSTRAINT map_locations_mapped_has_coords CHECK (
    (status = 'mapped' AND latitude IS NOT NULL AND longitude IS NOT NULL
                       AND unmapped_reason IS NULL)
    OR
    (status = 'unmapped' AND unmapped_reason IS NOT NULL)
  ),
  CONSTRAINT map_locations_latitude_range CHECK (
    latitude IS NULL OR (latitude BETWEEN -90 AND 90)
  ),
  CONSTRAINT map_locations_longitude_range CHECK (
    longitude IS NULL OR (longitude BETWEEN -180 AND 180)
  ),
  -- Belt and braces on the privacy rule: a held row must carry no address.
  CONSTRAINT map_locations_privacy_hold_has_no_address CHECK (
    unmapped_reason IS DISTINCT FROM 'privacy_hold'
    OR (address IS NULL AND postcode IS NULL
        AND latitude IS NULL AND longitude IS NULL)
  )
);

CREATE INDEX map_locations_status_idx ON public.map_locations (status) WHERE hidden = false;
CREATE INDEX map_locations_categories_idx ON public.map_locations USING gin (categories);

ALTER TABLE public.map_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_map_locations" ON public.map_locations
  FOR SELECT TO anon USING (hidden = false);
CREATE POLICY "auth_select_map_locations" ON public.map_locations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_map_locations" ON public.map_locations
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_update_map_locations" ON public.map_locations
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_map_locations" ON public.map_locations
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER map_locations_set_updated_at
  BEFORE UPDATE ON public.map_locations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
