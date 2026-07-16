import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { SEO } from "@/components/SEO";

type MapLocation = Tables<"map_locations">;

// Roughly centred on Bath, wide enough to take in Keynsham, the Chew Valley
// and the Somer Valley.
const CENTRE: [number, number] = [51.36, -2.44];
const ZOOM = 11;

const CATEGORIES = [
  { key: "grower", label: "Growers", colour: "#3f7d3f" },
  { key: "retail", label: "Retail", colour: "#b8562f" },
  { key: "distributor", label: "Distributors", colour: "#7a5ea8" },
  { key: "community", label: "Community", colour: "#2f6f8f" },
  { key: "wildlife", label: "Wildlife", colour: "#c9962c" },
  { key: "climate", label: "Climate", colour: "#b23b5e" },
  { key: "energy", label: "Energy", colour: "#157f7f" },
  { key: "skills", label: "Skills & repair", colour: "#5f6b7a" },
] as const;

const COLOUR = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.colour])) as Record<string, string>;

const UNMAPPED_HEADINGS: Record<string, string> = {
  district_wide: "Across the whole district",
  no_single_site: "Networks without a single site",
  not_published: "Location not published",
  privacy_hold: "Run from a private address",
};

const UNMAPPED_ORDER = ["district_wide", "no_single_site", "not_published", "privacy_hold"];

/**
 * A teardrop pin, coloured by the project's first *currently shown* category —
 * not simply its first, or a grower/community project would still draw green
 * after the Growers filter was switched off, contradicting the legend.
 */
const pinIcon = (categories: string[], active: string[]) => {
  const shown = categories.find((c) => active.includes(c)) ?? categories[0];
  const colour = COLOUR[shown] ?? "#3f7d3f";
  return L.divIcon({
    className: "",
    html: `<svg width="26" height="36" viewBox="0 0 26 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M13 0C5.8 0 0 5.8 0 13c0 9.1 11.4 21.6 11.9 22.1a1.5 1.5 0 0 0 2.2 0C14.6 34.6 26 22.1 26 13 26 5.8 20.2 0 13 0z" fill="${colour}"/>
      <circle cx="13" cy="13" r="5" fill="#fff"/>
    </svg>`,
    iconSize: [26, 36],
    iconAnchor: [13, 36],
    popupAnchor: [0, -34],
  });
};

const LocationsMapPage = () => {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [active, setActive] = useState<string[]>(CATEGORIES.map((c) => c.key));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("map_locations")
      .select("*")
      .eq("hidden", false)
      .order("name")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setLocations(data ?? []);
        setLoading(false);
      });
  }, []);

  const toggle = (key: string) =>
    setActive((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const visible = useMemo(
    () =>
      locations.filter(
        (l) => l.status === "mapped" && l.categories.some((c) => active.includes(c)),
      ),
    [locations, active],
  );

  // Part of each marker's key: Leaflet won't repaint an existing marker's icon
  // when the filters change, so the markers have to remount to recolour.
  const activeKey = active.join(",");

  const unmapped = useMemo(() => {
    const groups = new Map<string, MapLocation[]>();
    for (const l of locations) {
      if (l.status !== "unmapped" || !l.unmapped_reason) continue;
      const list = groups.get(l.unmapped_reason) ?? [];
      list.push(l);
      groups.set(l.unmapped_reason, list);
    }
    return UNMAPPED_ORDER.filter((r) => groups.has(r)).map((r) => ({
      reason: r,
      items: groups.get(r)!,
    }));
  }, [locations]);

  const mappedCount = locations.filter((l) => l.status === "mapped").length;

  return (
    <main>
      <SEO
        title="Map | Bath Area Growers"
        description="A map of community gardens, farms, growers, food retailers, wildlife, climate and energy projects across Bath and North East Somerset."
      />

      <section className="w-full bg-background-inverse py-10 md:py-[60px] px-4">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[28px] font-bold text-foreground-alt md:text-[48px]">Map</h1>
          <p className="mt-2 max-w-[640px] text-[18px] text-foreground-alt/60">
            Growing, food and environmental projects across Bath and North East Somerset — community
            gardens, farms, growers and retailers, the projects that move surplus food around, and
            the groups working on wildlife, climate and energy.
          </p>
        </div>
      </section>

      <section className="w-full bg-background py-8 md:py-12 px-4">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => {
              const on = active.includes(c.key);
              return (
                <button
                  key={c.key}
                  onClick={() => toggle(c.key)}
                  aria-pressed={on}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-semibold transition ${
                    on
                      ? "border-transparent text-white"
                      : "border-foreground/20 bg-transparent text-foreground/50"
                  }`}
                  style={on ? { backgroundColor: c.colour } : undefined}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: on ? "#fff" : c.colour }}
                  />
                  {c.label}
                </button>
              );
            })}
            <p className="ml-auto text-[14px] text-foreground/60">
              {loading ? "Loading…" : `${visible.length} of ${mappedCount} shown`}
            </p>
          </div>

          {error && (
            <p className="mb-4 rounded-md bg-destructive/10 p-4 text-[15px] text-destructive">
              The map couldn’t load: {error}
            </p>
          )}

          <div className="overflow-hidden rounded-md border border-foreground/10">
            <MapContainer
              center={CENTRE}
              zoom={ZOOM}
              scrollWheelZoom={false}
              style={{ height: "clamp(420px, 65vh, 700px)", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
              <MarkerClusterGroup chunkedLoading maxClusterRadius={45}>
                {visible.map((l) => (
                  <Marker
                    key={`${l.id}-${activeKey}`}
                    position={[l.latitude!, l.longitude!]}
                    icon={pinIcon(l.categories, active)}
                  >
                    <Popup>
                      <strong className="text-[15px]">{l.name}</strong>
                      {l.area && <div className="text-[13px] opacity-70">{l.area}</div>}
                      {l.address && <div className="mt-1 text-[13px]">{l.address}</div>}
                      {l.postcode && <div className="text-[13px]">{l.postcode}</div>}
                      {l.location_note && <div className="mt-1 text-[13px] italic">{l.location_note}</div>}
                      {l.pin_precision === "approx" && (
                        <div className="mt-1 text-[12px] opacity-60">Approximate location</div>
                      )}
                      {l.external_link && (
                        <a
                          href={l.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-[13px] font-semibold underline"
                        >
                          Visit website
                        </a>
                      )}
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>

          <p className="mt-3 text-[13px] text-foreground/50">
            Some pins are approximate. Always check with a project before travelling — several are
            working farms or appointment-only.
          </p>
        </div>
      </section>

      {unmapped.length > 0 && (
        <section className="w-full bg-white py-10 md:py-16 px-4">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-[24px] font-bold md:text-[32px]">Not on the map</h2>
            <p className="mt-2 max-w-[640px] text-[16px] text-foreground/70">
              These groups are part of the picture but don’t have a single spot to pin — they work
              across the district, campaign rather than run a site, or operate from a private
              address. Many are networks whose whole point is that they’re everywhere.
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {unmapped.map(({ reason, items }) => (
                <div key={reason}>
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground/50">
                    {UNMAPPED_HEADINGS[reason] ?? reason}
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {items.map((l) => (
                      <li key={l.id}>
                        {l.external_link ? (
                          <a
                            href={l.external_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[16px] font-semibold hover:underline"
                          >
                            {l.name}
                          </a>
                        ) : (
                          <span className="text-[16px] font-semibold">{l.name}</span>
                        )}
                        {l.area && <span className="text-[14px] text-foreground/50"> — {l.area}</span>}
                        {l.location_note && (
                          <p className="text-[14px] text-foreground/60">{l.location_note}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default LocationsMapPage;
