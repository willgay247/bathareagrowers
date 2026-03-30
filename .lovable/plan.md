

# Tidy Up Navigation with Dropdowns

## What changes
Replace the flat 10-link navbar with 5 top-level items, three of which have dropdown submenus:

```text
Home | Locations ▾ | Doing Good ▾ | Resources ▾ | Contact

Locations:      Community Gardens, Farms
Doing Good:     Supported Gardening, Wildlife Gardening, Surplus Projects
Resources:      Courses, Resources, Events
```

## How

**File: `src/components/Navbar.tsx`** — full rewrite:

- **Desktop**: Use a simple hover/focus dropdown pattern (no external dependency needed — just `group` + `group-hover` Tailwind classes, or a small `useState` per dropdown). Each dropdown renders a positioned `div` with links.
- **Mobile**: Collapsible accordion-style sections. Tapping "Locations" expands its sub-links, etc. Plain links (Home, Contact) navigate directly.
- Keep the same sticky header, same styling tokens (`bg-background-alt`, `text-foreground`, `text-accent`), same active-state highlighting.

No other files change. No new dependencies needed.

## Technical detail

Desktop dropdown pattern per group:
```tsx
<div className="relative group">
  <button className="...">Locations <ChevronDown /></button>
  <div className="absolute hidden group-hover:flex flex-col bg-background-alt shadow-lg ...">
    <Link to="/community-gardens">Community Gardens</Link>
    <Link to="/farms">Farms</Link>
  </div>
</div>
```

Mobile: track which group is expanded via `openGroup` state; toggle on tap.

