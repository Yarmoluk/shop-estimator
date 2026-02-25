# Shop Estimator

Free pricing widget for tattoo shops, salons, and small businesses. Your customers estimate their own price right on your website. You stop answering "how much?" in your DMs.

**[Try the live demo + get your code](https://yarmoluk.github.io/shop-estimator/go.html)**

---

## Install in 60 Seconds

1. Go to **[yarmoluk.github.io/shop-estimator/go.html](https://yarmoluk.github.io/shop-estimator/go.html)**
2. Fill in your shop name, rates, and artists
3. Click **Copy Code**
4. Paste it on your website (WordPress, Squarespace, Wix, Shopify — anything)

That's it. Your customers can now estimate their price and book a consultation.

---

## What You Can Customize

Everything is editable. No code experience needed — just fill in the form on the install page.

| Setting | What it does |
|---------|-------------|
| **Shop Name** | Shows in the widget header |
| **Minimum Price** | Price floor — estimates won't go below this |
| **Hourly Rate** | Default rate used for calculations |
| **Brand Color** | Matches your shop's look |
| **Booking Link** | "Get Your Exact Quote" button goes here |
| **Business Type** | Tattoo, Hair Salon, Nail Salon, or Auto Detail |

### Adding Your Artists

Add as many artists as you want (up to 15). Each artist gets their own card with:

- **Name** — displayed to customers
- **Tier** — Junior, Senior, Master, Owner, Guest
- **Rate** — hourly rate, or flat/day rate for premium artists
- **Bio** — short description (specialties, years of experience)
- **Styles** — comma-separated list (shows as tags on the card)

When customers use the widget, they pick their artist first. The estimate adjusts to that artist's rate automatically.

**Hourly artists:**
> Sarah — Senior — $150/hr — "Bold color specialist, 8 years"

**Flat-rate artists:**
> Nick — Owner — $950/session or $1500/full day — "Books 3+ months out"

If you don't add any artists, the widget skips that step and uses your default hourly rate. Both ways work.

---

## How It Works (For Developers)

### Embed Code

```html
<script src="https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/engine.js"
  data-config="https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/tattoo.json"
  data-shop="Your Shop Name"
  data-minimum="100"
  data-hourly="150"
  data-accent="#e94560"
  data-booking="https://your-booking-link.com"></script>
```

### Data Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-config` | URL to a JSON config file | `configs/tattoo.json` |
| `data-config-inline` | JSON string merged on top of the config (for artists, overrides) | — |
| `data-shop` | Business name | From config |
| `data-minimum` | Price floor | From config |
| `data-hourly` | Hourly rate | From config |
| `data-accent` | Brand color (hex) | From config |
| `data-booking` | Booking URL | Hidden if empty |

### Available Configs

| Business | Config | Accent |
|----------|--------|--------|
| Tattoo Shop | `configs/tattoo.json` | `#e94560` |
| Hair Salon | `configs/hair-salon.json` | `#d4a574` |
| Nail Salon | `configs/nail-salon.json` | `#e8a0bf` |
| Auto Detail | `configs/auto-detail.json` | `#4a90d9` |

### Config Schema

Configs are JSON files that define the steps, options, and pricing logic. You can create one for any service business.

**Group types:**

| Type | What it does |
|------|-------------|
| `select` | Pick one option (size, placement, color) |
| `multiselect` | Pick multiple options (styles — select all that apply) |
| `toggle` | On/off switch (cover-up, custom design) |
| `artist` | Artist picker with per-artist rates |

**Pricing math:**
- First `select` group with `hours` on its options = base time estimate
- All other groups use `mult` (multiplier) to adjust price
- Final price = `base_hours × hourly_rate × all_multipliers`, shown as a range
- Artists with `rateType: "flat"` use session/day pricing instead of hourly

**Adding artists to a config (top-level array):**

```json
{
  "artists": [
    {
      "name": "Sarah",
      "tier": "Senior",
      "hourly": 150,
      "rateType": "hourly",
      "bio": "Bold color specialist",
      "styles": ["Traditional", "Neo-Trad", "Color"]
    },
    {
      "name": "Nick",
      "tier": "Owner",
      "rateType": "flat",
      "rates": [
        { "label": "Session", "price": 950, "maxHours": 6 },
        { "label": "Full Day", "price": 1500 }
      ],
      "bio": "Premium large-scale work",
      "styles": ["Japanese", "Realism"]
    }
  ],
  "steps": [ ... ]
}
```

When `artists` is present, the engine auto-creates an "Choose Your Artist" step. No artists = step is skipped.

### Features

- Zero dependencies, self-contained IIFE
- All CSS scoped with `.te-` prefix (no host site collisions)
- Mobile-first responsive design
- Multi-step form with progress dots
- Multi-session auto-detection (flags large jobs)
- Image upload for reference photos (client-side only)
- Custom disclaimer support
- Aftercare product recommendations (affiliate links)
- "Powered by Shop Estimator" watermark

### CDN URLs

| File | URL |
|------|-----|
| Engine | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/engine.js` |
| Tattoo config | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/tattoo.json` |
| Hair Salon config | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/hair-salon.json` |
| Nail Salon config | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/nail-salon.json` |
| Auto Detail config | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/auto-detail.json` |

---

## License

MIT
