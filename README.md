# Shop Estimator

Free, embeddable pricing estimator widget for small businesses. Config-driven. Zero dependencies. Works on any website.

## Quick Start

Paste this on any webpage to add a tattoo pricing estimator:

```html
<!-- Tattoo Price Estimator Widget -->
<script src="https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/engine.js"
  data-config="https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/tattoo.json"
  data-shop="Your Shop Name"
  data-minimum="100"
  data-hourly="150"
  data-accent="#e94560"
  data-booking="https://your-booking-link.com"></script>
```

## Available Verticals

| Vertical | Config URL | Default Accent |
|----------|-----------|----------------|
| Tattoo | `configs/tattoo.json` | `#e94560` |
| Hair Salon | `configs/hair-salon.json` | `#d4a574` |
| Nail Salon | `configs/nail-salon.json` | *(see config)* |
| Auto Detail | `configs/auto-detail.json` | *(see config)* |

To use a different vertical, just change the `data-config` URL:

```html
<script src="https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/engine.js"
  data-config="https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/hair-salon.json"
  data-shop="Luxe Hair Studio"
  data-minimum="40"
  data-hourly="75"></script>
```

## Create a Custom Vertical

Create a JSON config file with this structure:

```json
{
  "vertical": "your-vertical",
  "title": "Price Estimator",
  "currency": "$",
  "defaults": {
    "shop": "Your Business Name",
    "minimum": 50,
    "hourly": 100,
    "accent": "#e94560",
    "booking": ""
  },
  "steps": [
    {
      "title": "Step Name",
      "groups": [
        {
          "key": "unique_key",
          "title": "Question for the customer?",
          "subtitle": "Helper text",
          "type": "select",
          "layout": "half",
          "options": [
            { "label": "Option A", "desc": "Description", "hours": 1.0 },
            { "label": "Option B", "desc": "Description", "hours": 2.0 }
          ]
        },
        {
          "key": "modifier_key",
          "title": "Another question?",
          "type": "select",
          "layout": "third",
          "options": [
            { "label": "Standard", "mult": 1.0 },
            { "label": "Premium", "mult": 1.3 }
          ]
        },
        {
          "key": "toggle_key",
          "title": "Optional add-on?",
          "type": "toggle",
          "mult_on": 1.2,
          "mult_off": 1.0,
          "default": false
        }
      ]
    }
  ],
  "products": [
    {
      "name": "Product Name",
      "url": "https://example.com",
      "price": "$19.99",
      "desc": "Short description"
    }
  ],
  "productsTitle": "Recommended Products",
  "disclaimer": "Disclaimer text here."
}
```

**Key rules:**
- The first `select` group with `hours` on its options sets the base time estimate.
- All other `select` groups use `mult` (multiplier) to adjust the price up or down.
- `toggle` groups use `mult_on` / `mult_off` for their multiplier.
- Final price = `base_hours * hourly_rate * product_of_all_multipliers`, shown as a +/- 25% range.

Host your custom config anywhere and point `data-config` to it.

## CDN URLs (jsDelivr)

| File | URL |
|------|-----|
| Engine (main) | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/engine.js` |
| Widget (tattoo compat) | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/widget.js` |
| Tattoo config | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/tattoo.json` |
| Hair Salon config | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/hair-salon.json` |
| Nail Salon config | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/nail-salon.json` |
| Auto Detail config | `https://cdn.jsdelivr.net/gh/Yarmoluk/shop-estimator@latest/configs/auto-detail.json` |

## Data Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-config` | URL to a JSON config file | Falls back to `configs/tattoo.json` |
| `data-shop` | Business name shown in header | From config |
| `data-minimum` | Minimum price floor | From config |
| `data-hourly` | Hourly rate for estimates | From config |
| `data-accent` | Brand color (hex) | From config |
| `data-booking` | Booking/consultation URL | Hidden if empty |

## Backward Compatibility

`widget.js` is a backward-compatible wrapper for the original tattoo-only embed API. It loads `engine.js` with `configs/tattoo.json` automatically. Existing embeds using `widget.js` will continue to work with no changes.

For new installs, use `engine.js` directly with a `data-config` attribute to pick any vertical.

## License

MIT
