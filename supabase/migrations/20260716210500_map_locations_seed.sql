-- Seed for public.map_locations: every growing, horticultural, CIC and
-- charitable food project on the Bath Area Growers map.
--
-- Merged from three sources: the B&NES "Grown in Bath and North East Somerset"
-- printed map (council_ref), the Bath Area Growers network poster, and the
-- existing CMS tables. Addresses were then researched from each organisation's
-- own published sources and geocoded from full postcodes via postcodes.io.
--
-- NOT EVERY ROW HAS A PIN, on purpose:
--   district_wide  - operates district-wide, no single site (the printed map
--                    lists these separately too)
--   no_single_site - umbrella/network org whose only address is a volunteer's home
--   not_published  - has a site but publishes no address
--   privacy_hold   - address known but it is a private home. Stored with NO
--                    address or coordinates. Get consent before filling it in.
--
-- Idempotent: safe to re-run.

INSERT INTO public.map_locations
  (slug, name, area, address, postcode, latitude, longitude,
   categories, org_type, status, unmapped_reason, pin_precision,
   location_note, source_url, council_ref)
VALUES
  ('alice-park-community-garden', 'Alice Park Community Garden', 'Larkhall, Bath', NULL, NULL, 51.397995, -2.339837, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'exact', NULL, NULL, 1),
  ('bath-city-farm', 'Bath City Farm', 'Twerton, Bath', NULL, NULL, 51.374999, -2.394686, ARRAY['grower']::text[], 'charity', 'mapped', NULL, 'exact', NULL, NULL, 2),
  ('bath-community-kitchen', 'Bath Community Kitchen', 'Bath', NULL, NULL, NULL, NULL, ARRAY['community']::text[], NULL, 'unmapped', 'no_single_site', NULL, 'A network without a single growing site of its own.', 'https://www.bathcommunitykitchen.org.uk/', 3),
  ('bath-farmers-market', 'Bath Farmer''s Market', 'Green Park Station, Bath', NULL, NULL, 51.381544, -2.366348, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'exact', NULL, NULL, 4),
  ('bath-harvest-rapeseed-oil', 'Bath Harvest Rapeseed Oil', 'Englishcombe', 'Wilmington Farm, Wilmington, Bath', 'BA2 9JB', 51.360702, -2.442198, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'exact', 'A working farm and press, not a shop.', 'https://www.bathharvestoils.co.uk/contact', 5),
  ('bath-organic-group', 'Bath Organic Group', 'Royal Victoria Park, Bath', NULL, NULL, 51.386538, -2.375593, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'exact', NULL, NULL, 6),
  ('bath-penn-hill-farm-shop', 'Bath Penn Hill Farm Shop', 'Upper Weston, Bath', 'Penn Hill Road, Bath', 'BA1 3RX', 51.392679, -2.401731, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'approx', 'Location approximate - please check before travelling.', 'https://penn-hill.com/', 7),
  ('bath-soft-cheeses', 'Bath Soft Cheeses', 'Kelston', NULL, NULL, 51.404152, -2.436272, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'exact', NULL, NULL, 8),
  ('combe-hay-vineyard', 'Combe Hay Vineyard', 'Combe Hay', 'Combe Hay Vineyard, Combe Hay, Bath', 'BA2 7EF', 51.340885, -2.374848, ARRAY['grower', 'retail']::text[], NULL, 'mapped', NULL, 'exact', NULL, 'https://combehayvineyard.co.uk/contact-us/', 9),
  ('corston-community-orchard', 'Corston Community Orchard', 'Corston', 'Corston Lane, Corston, Bath', 'BA2 9AF', 51.388275, -2.441027, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'approx', 'Location approximate - a field on the edge of the village.', 'https://www.farmgarden.org.uk/org/public-profile/70774', 10),
  ('dick-willows-farm', 'Dick Willows Farm', 'Bathampton area', 'Orchard Fields, Claverton Hill, Claverton Down, Bath', 'BA2 7BB', 51.3739186, -2.3154865, ARRAY['grower', 'retail']::text[], NULL, 'mapped', NULL, 'approx', 'Moved from the Bathford site - worth checking before you travel.', 'https://bathandborders.camra.org.uk/viewnode.php?id=201855', 11),
  ('dry-arch-growers', 'Dry Arch Growers', 'Bathampton, Bath', NULL, NULL, 51.392467, -2.316762, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'exact', NULL, NULL, 12),
  ('fine-cheese-company', 'Fine Cheese Company', 'Bath', NULL, NULL, 51.384707, -2.35977, ARRAY['retail']::text[], 'commercial', 'mapped', NULL, 'exact', NULL, NULL, 13),
  ('foodcycle-bath', 'FoodCycle Bath', 'Bath', 'Walcot Methodist Chapel, Nelson Place, Walcot, Bath', 'BA1 5DA', 51.389574, -2.358245, ARRAY['community']::text[], 'charity', 'mapped', NULL, 'exact', 'Free three-course meal, 7pm Wednesdays. Just turn up.', 'https://foodcycle.org.uk/location/foodcycle-bath/', 14),
  ('grow-for-life-bath', 'Grow for Life', 'Newton St Loe', 'The Walled Garden, Home Farm Yard, off Farm Lane, Newton St Loe, Bath', 'BA2 9BZ', 51.381507, -2.425601, ARRAY['grower', 'community']::text[], NULL, 'mapped', NULL, 'exact', 'The walled garden is open by appointment only.', 'https://www.growforlife.org.uk/contact', 15),
  ('harvest', 'Harvest', 'Bath', NULL, NULL, 51.384953, -2.35983, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'exact', NULL, NULL, 16),
  ('honeys-midford-cider', 'Honey''s Midford Cider', 'Midford', 'Upper Midford Farm, Midford, Bath', 'BA2 7EJ', 51.344068, -2.351787, ARRAY['grower', 'retail']::text[], NULL, 'mapped', NULL, 'approx', 'A working farm - no public shop.', 'https://www.somersetfarmersmarkets.co.uk/honeys-cider/', 17),
  ('larkhall-butchers', 'Larkhall Butchers', 'Larkhall, Bath', NULL, NULL, 51.397353, -2.345409, ARRAY['retail']::text[], 'commercial', 'mapped', NULL, 'exact', NULL, NULL, 18),
  ('middle-ground-growers', 'Middle Ground Growers', 'Weston, Bath', NULL, NULL, 51.407564, -2.410107, ARRAY['grower', 'retail']::text[], NULL, 'mapped', NULL, 'exact', NULL, NULL, 19),
  ('minerva-wine', 'Minerva Wine', 'Corston', 'Corston Fields Farm, Corston, Bath', 'BA2 9EZ', 51.381937, -2.468612, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'approx', 'The entrance is off the A39.', 'https://www.visitbath.co.uk/things-to-do/minerva-wine-corston-vineyard-estate-p3771193', 20),
  ('newton-farm-foods', 'Newton Farm Foods', 'Newton St Loe', NULL, NULL, 51.380945, -2.426848, ARRAY['grower', 'retail']::text[], 'commercial', 'mapped', NULL, 'exact', NULL, NULL, 21),
  ('smallcombe-nuttery', 'Smallcombe Nuttery', 'Bath', 'Smallcombe Vale, off Horseshoe Walk, Widcombe, Bath', NULL, 51.376388, -2.345045, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'exact', 'On National Trust land beside the Skyline Walk. Foot access from Horseshoe Walk.', 'https://www.google.com/maps/d/viewer?mid=1WbFakKH8xq89cW68iIwJ8bCpMkg', 22),
  ('the-urban-garden', 'The Urban Garden', 'Bath', 'Marlborough Buildings, Royal Victoria Park, Bath', 'BA1 2LZ', 51.386384, -2.371901, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'exact', 'Entrance on the corner of Marlborough Buildings and Royal Avenue.', 'https://www.theurbangarden.org.uk/about-us.html', 23),
  ('undercliff-urban-farm', 'Undercliff Urban Farm', 'Bathampton, Bath', NULL, NULL, NULL, NULL, ARRAY['grower', 'retail']::text[], NULL, 'unmapped', 'not_published', NULL, 'No public address published - get in touch with them directly.', 'https://www.undercliffurbanfarm.co.uk/', 24),
  ('waterleaze-growers', 'Waterleaze Growers', 'Upper Swainswick', 'Bailbrook Lane, Batheaston, Bath', 'BA1 7AA', 51.403455, -2.328178, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'approx', 'Off Bailbrook Lane, on the lower slopes of Solsbury Hill.', 'https://www.farmgarden.org.uk/org/public-profile/81175', 25),
  ('wild-walcot', 'Wild Walcot', 'Walcot, Bath', NULL, NULL, 51.386216, -2.359608, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'exact', NULL, NULL, 26),
  ('brook-farmhouse-butchery', 'Brook Farmhouse Butchery', 'Chew Magna', NULL, NULL, NULL, NULL, ARRAY['retail']::text[], NULL, 'unmapped', 'privacy_hold', NULL, 'Run from a private address, so it is not shown here.', 'https://ratings.food.gov.uk/business/1125918', 27),
  ('homewood-cheeses', 'Homewood Cheeses', 'Hinton Blewett', 'Unit 4, The Old Sawmill, Ubley, Bristol', 'BS40 6PE', 51.317586, -2.677313, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'exact', 'A production dairy, not a shop. Sells at Bath Farmers'' Market.', 'http://www.homewoodcheeses.co.uk/contact', 28),
  ('limeburn-hill-vineyard', 'Limeburn Hill Vineyard', 'Chew Magna', 'Westfield Farm, Limeburn Hill, Chew Magna, Bristol', 'BS40 8QW', 51.37033, -2.629449, ARRAY['grower', 'retail']::text[], NULL, 'mapped', NULL, 'exact', 'Visits by booked tour only.', 'https://www.limeburnhillvineyard.co.uk/', 29),
  ('new-manor-farm-and-shop', 'New Manor Farm and Shop', 'Chew Valley', 'New Manor Farm, Bath Road, West Harptree, Bristol', 'BS40 6HW', 51.322506, -2.611831, ARRAY['grower', 'retail']::text[], NULL, 'mapped', NULL, 'exact', 'Farm shop, butchery and tea rooms. Open seven days.', 'https://ratings.food.gov.uk/business/search?q=New+Manor+Farm+Shop', 30),
  ('the-community-farm', 'The Community Farm', 'Chew Magna', 'Denny Lane, Chew Magna, Somerset', 'BS40 8SZ', 51.354637, -2.611254, ARRAY['grower', 'retail']::text[], NULL, 'mapped', NULL, 'exact', 'The field entrance is at the far end of Denny Lane.', 'https://www.thecommunityfarm.co.uk/about-us/find-us', 31),
  ('westfield-farm', 'Westfield Farm', 'Chew Valley', 'Westfield Farm, Limeburn Hill, Chew Magna', 'BS40 8QW', 51.37033, -2.629449, ARRAY['grower', 'retail']::text[], NULL, 'mapped', NULL, 'exact', 'A 30-acre site hosting the vineyard, Wilding Orchard and a forest garden.', 'https://www.somersetfoodtrail.org/sft-2025-participants/limeburn-hill-vineyard', 32),
  ('wilding-orchard', 'Wilding Orchard', 'Chew Valley', 'Wilding Orchard, Westfield Farm, Limeburn Hill, Chew Magna', 'BS40 8QW', 51.37033, -2.629449, ARRAY['grower', 'retail']::text[], NULL, 'mapped', NULL, 'exact', 'On the Westfield Farm site. Sales by appointment, cases of six or more.', 'https://www.wildingcider.co.uk/contact', 33),
  ('heavenly-hedgerows', 'Heavenly Hedgerows', 'Keynsham', NULL, NULL, NULL, NULL, ARRAY['retail']::text[], NULL, 'unmapped', 'privacy_hold', NULL, 'Run from a private address, so it is not shown here.', 'https://www.heavenlyhedgerows.co.uk/terms-of-use', 34),
  ('keynsham-community-fridge', 'Keynsham Community Fridge', 'Keynsham', 'Savour Kitchen, 20 Temple Street, Keynsham', 'BS31 1EH', 51.413279, -2.497749, ARRAY['community']::text[], NULL, 'mapped', NULL, 'exact', 'Hosted by Savour Kitchen - open when they are: weekdays 8.30-4, weekends 9-3. Free, no eligibility criteria.', 'http://www.keynsham-tc.gov.uk/_UserFiles/Files/Final%20version%20Affordable%20Food%20in%20Keynsham%20and%20Saltford.pdf', 35),
  ('keynsham-farmers-market', 'Keynsham Farmers Market', 'Keynsham', 'Market Walk, Keynsham', 'BS31 1FS', 51.414118, -2.497025, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'exact', 'Second Saturday of the month, 9am-1pm, on Market Walk.', 'https://www.somersetfarmersmarkets.co.uk/markets/keynsham/', 36),
  ('cam-valley-growers', 'Cam Valley Growers', 'Camerton', NULL, NULL, NULL, NULL, ARRAY['grower', 'retail']::text[], NULL, 'unmapped', 'privacy_hold', NULL, 'Run from a private address, so it is not shown here.', 'https://cam-valley-growers.ooooby.org/', 37),
  ('farringtons-farm-shop', 'Farrington''s Farm Shop', 'Farrington Gurney', NULL, NULL, 51.297007, -2.525665, ARRAY['retail']::text[], 'commercial', 'mapped', NULL, 'exact', NULL, NULL, 38),
  ('grow-timsbury', 'Grow Timsbury', 'Timsbury', NULL, NULL, NULL, NULL, ARRAY['grower']::text[], NULL, 'unmapped', 'no_single_site', NULL, 'A network without a single growing site of its own.', 'https://growtimsbury.org.uk/about-us/', 39),
  ('midsomer-norton-farmers-market', 'Midsomer Norton Farmers Market', 'Midsomer Norton', 'Hollies Gardens, High Street, Midsomer Norton, Radstock', 'BA3 2DP', 51.286189, -2.482408, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'exact', 'First Saturday of the month, 9am-1pm.', 'https://www.somersetfarmersmarkets.co.uk/markets/midsomer-norton/', 40),
  ('somer-valley-brewing', 'Somer Valley Brewing', 'Peasedown St John', 'Knoll Farm, White Ox Mead, Peasedown St John, Bath', 'BA2 8PL', 51.322096, -2.413557, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'exact', 'On the Somer Valley Farms site at Knoll Farm.', 'https://camra.org.uk/brewery/somer-valley-bath-35360', 41),
  ('somer-valley-farms', 'Somer Valley Farms', 'Dunkerton', 'Knoll Farm, White Ox Mead, Peasedown St John, Bath', 'BA2 8PL', 51.322096, -2.413557, ARRAY['grower', 'retail']::text[], NULL, 'mapped', NULL, 'exact', 'On-farm butcher, deli and brewery. Open Wed-Sat.', 'https://www.somersetfarmersmarkets.co.uk/somer-valley-farms/', 42),
  ('willow-farm-gourmet', 'Willow Farm Gourmet', 'Timsbury area', 'Willow Farm, Flatts Lane, Timsbury, Bath', 'BA2 0HJ', 51.334655, -2.510119, ARRAY['retail']::text[], NULL, 'mapped', NULL, 'exact', 'By appointment, Thu-Sat 9.30-2.30. Now trading as Alcoholery.', 'http://alcoholery.co.uk/', 43),
  ('avon-gleaning', 'Avon Gleaning Network', 'District wide', NULL, NULL, NULL, NULL, ARRAY['distributor']::text[], NULL, 'unmapped', 'district_wide', NULL, 'Works across the whole district rather than from one site.', NULL, NULL),
  ('cropdrop', 'Cropdrop', 'District wide', NULL, NULL, NULL, NULL, ARRAY['distributor']::text[], NULL, 'unmapped', 'district_wide', NULL, 'Works across the whole district rather than from one site.', NULL, NULL),
  ('orchardshare', 'Orchardshare', 'District wide', NULL, NULL, NULL, NULL, ARRAY['distributor']::text[], NULL, 'unmapped', 'district_wide', NULL, 'Works across the whole district rather than from one site.', NULL, NULL),
  ('wild-about-weston', 'Wild About Weston', 'Weston, Bath', NULL, NULL, NULL, NULL, ARRAY['grower']::text[], NULL, 'unmapped', 'no_single_site', NULL, 'A network without a single growing site of its own.', 'https://www.wown.live/Articles/658406/Wild_about_Weston.aspx', NULL),
  ('more-trees-banes', 'More Trees BANES', 'Bath', NULL, NULL, NULL, NULL, ARRAY['grower']::text[], NULL, 'unmapped', 'no_single_site', NULL, 'A network without a single growing site of its own.', 'https://moretrees.earth/', NULL),
  ('grow-batheaston', 'Grow Batheaston', 'Batheaston, Bath', NULL, NULL, NULL, NULL, ARRAY['grower']::text[], NULL, 'unmapped', 'no_single_site', NULL, 'A network without a single growing site of its own.', 'https://www.growbatheaston.co.uk/about-us', NULL),
  ('roots-allotments', 'Roots Allotments', 'Bath', 'Avon Views, Bathford, Bath', 'BA1 8ED', 51.394651, -2.305477, ARRAY['grower']::text[], 'commercial', 'mapped', NULL, 'approx', 'A rural postcode, so the pin is approximate. what3words: ///hers.goal.struck', 'https://bath.resilienceweb.org.uk/roots-allotments-bathford', NULL),
  ('time-bank-plus', 'Time Bank Plus', 'Bath', '86 High Street, Twerton, Bath', 'BA2 1DE', 51.380065, -2.395946, ARRAY['community', 'grower']::text[], NULL, 'mapped', NULL, 'approx', 'Twerton Lunch Club runs here on Wednesdays. Office open Tue and Wed, 10-4.', 'https://timebankplus.co.uk/wp/contact-us', NULL),
  ('blooming-whiteway', 'Blooming Whiteway', 'Whiteway, Bath', NULL, NULL, 51.376368, -2.40859, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'exact', NULL, NULL, NULL),
  ('bath-mind', 'Bath Mind', 'Bath', 'Monksdale Road Allotments, Monksdale Road, Bath', 'BA2 2JD', 51.371832, -2.381264, ARRAY['community']::text[], 'charity', 'mapped', NULL, 'exact', 'Greenlinks growing sessions: Tue 11.30-2.30, Thu 10-1. GBP 2 a session.', 'https://www.bathmind.org.uk/our-services/wellbeing-groups/greenlinks/', NULL),
  ('bnes-allotments-association', 'B&NES Allotments Association', 'Bath', NULL, NULL, NULL, NULL, ARRAY['community']::text[], NULL, 'unmapped', 'no_single_site', NULL, 'A network without a single growing site of its own.', 'https://www.bathallotments.org/', NULL),
  ('transition-bath', 'Transition Bath', 'Bath', NULL, NULL, NULL, NULL, ARRAY['community']::text[], 'charity', 'unmapped', 'no_single_site', NULL, 'A network without a single growing site of its own.', 'https://transitionbath.org/project/community-growing/', NULL),
  ('wild-about-bath', 'Wild About Bath', 'Bath', NULL, NULL, NULL, NULL, ARRAY['grower']::text[], NULL, 'unmapped', 'no_single_site', NULL, 'A network without a single growing site of its own.', 'https://wildaboutbath.org/contact/', NULL),
  ('timebank-plus-community-allotment', 'Timebank Plus Community Allotment', 'West Bath', 'Bath City Farm, Kelston View, Whiteway, Bath', 'BA2 1NW', 51.375806, -2.397576, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'approx', 'The allotment is hosted at Bath City Farm.', 'http://timebankplus.co.uk/wp/newsletter', NULL),
  ('from-the-land', 'From the Land', 'West Bath', NULL, NULL, NULL, NULL, ARRAY['grower']::text[], NULL, 'unmapped', 'not_published', NULL, 'No public address published - get in touch with them directly.', NULL, NULL),
  ('hanna-close-community-garden', 'Hanna Close Community Garden', 'West Bath', NULL, NULL, 51.378818, -2.39701, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'exact', NULL, NULL, NULL),
  ('batheaston-forest-garden', 'Batheaston Forest Garden', 'Batheaston, Bath', 'Secret Garden, Batheaston Riverside and Garden, London Road East, Batheaston, Bath', 'BA1 7NB', 51.405238, -2.317707, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'approx', 'Always open and free. The pin is the adjoining riverside car park.', 'https://www.growbatheaston.co.uk/forest-garden', NULL),
  ('avonleigh-orchards', 'Avonleigh Orchards', 'Bath area', 'Leigh Road, Bradford-on-Avon, Wiltshire', 'BA15 2RD', 51.356089, -2.242361, ARRAY['grower']::text[], NULL, 'mapped', NULL, 'exact', 'In Bradford-on-Avon, just outside B&NES.', 'https://www.bradfordonavon.co.uk/shops/avonleigh-orchards/', NULL),
  ('abundance-by-design', 'Abundance by Design', 'Bath area', NULL, NULL, NULL, NULL, ARRAY['grower']::text[], NULL, 'unmapped', 'not_published', NULL, 'No public address published - get in touch with them directly.', NULL, NULL),
  ('mind-greenlinks-allotment', 'Mind Greenlinks Allotment', 'Oldfield Park, Bath', NULL, NULL, 51.372506, -2.382233, ARRAY['grower', 'community']::text[], 'charity', 'mapped', NULL, 'exact', NULL, NULL, NULL),
  ('ciderspace', 'Ciderspace', 'Bath area', NULL, NULL, NULL, NULL, ARRAY['distributor']::text[], NULL, 'unmapped', 'district_wide', NULL, 'Works across the whole district rather than from one site.', NULL, NULL)
ON CONFLICT (slug) DO UPDATE SET
  name            = EXCLUDED.name,
  area            = EXCLUDED.area,
  address         = EXCLUDED.address,
  postcode        = EXCLUDED.postcode,
  latitude        = EXCLUDED.latitude,
  longitude       = EXCLUDED.longitude,
  categories      = EXCLUDED.categories,
  org_type        = EXCLUDED.org_type,
  status          = EXCLUDED.status,
  unmapped_reason = EXCLUDED.unmapped_reason,
  pin_precision   = EXCLUDED.pin_precision,
  location_note   = EXCLUDED.location_note,
  source_url      = EXCLUDED.source_url,
  council_ref     = EXCLUDED.council_ref,
  updated_at      = now();
