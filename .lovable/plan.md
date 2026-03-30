

## Plan: Move newsletter & social links into footer, remove social row from navbar

### What changes

1. **Footer.tsx** — Rebuild to include:
   - Newsletter signup form (email input + subscribe button + Mailchimp anti-bot field) styled for the dark accent background
   - Social icons row (Facebook, Instagram, Email) using lucide icons
   - A "Contact Us" link pointing to `/contact`
   - Existing contact info (email, phone, org name)

2. **Navbar.tsx** — Remove the social icons row (lines 30–46), keeping only the nav links and hamburger menu

3. **Index.tsx** — Remove the standalone `<NewsletterSignup />` component usage since it now lives in the footer on every page

4. **NewsletterSignup.tsx** — Can be deleted (its form markup moves into Footer)

### Footer layout (rough structure)

```text
┌──────────────────────────────────────────────┐
│  Sign up to the BAG newsletter               │
│  [email input        ] [Subscribe]           │
│                                              │
│  Bath Area Growers                           │
│  Email: info@bathareagrowers.org             │
│  Tel: 07913617822                            │
│                                              │
│  [FB] [IG] [✉]  ·  Contact Us               │
└──────────────────────────────────────────────┘
```

### Technical details
- Footer gets `import { Link } from "react-router-dom"` and lucide icons
- Newsletter form text/inputs restyle to `text-foreground-alt` to work on the accent background
- Social links array reused from current Navbar constants

