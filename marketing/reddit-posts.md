# Reddit Posts — Copy/Paste Ready

---

## r/SideProject

**Title:** I built a free pricing widget for small businesses — tattoo shops, salons, auto detailers

**Body:**

Built an embeddable pricing estimator that any service business can drop on their website with one line of code.

Customer picks their service specs (size, style, complexity, etc), gets an instant price range, and clicks through to book. The business stops answering "how much?" over DM 30 times a week.

It's config-driven — I made configs for tattoo shops, hair salons, nail salons, and auto detailers but you can create one for any service business.

- Zero dependencies, self-contained JavaScript
- Works on WordPress, Squarespace, Wix, Shopify, anything
- Fully customizable (shop name, rates, brand color, booking link)
- Free. Monetized through aftercare product affiliate links

Live demo + install: https://yarmoluk.github.io/shop-estimator/go.html

Source: https://github.com/Yarmoluk/shop-estimator

Would love feedback. What verticals would you want to see next?

---

## r/smallbusiness

**Title:** Free tool I built — lets your customers estimate their own price on your website

**Body:**

I kept hearing from shop owners (tattoo, hair, nails) that they spend hours answering "how much for a ___?" So I built a free widget that handles it.

You paste one line of code on your website. Customer picks their specs, gets a price range, and clicks "Book a Consultation." You get a lead that already knows your rates and is actually serious.

Works for:
- Tattoo shops (size, style, placement, color, cover-ups)
- Hair salons (service, stylist tier, hair type, add-ons)
- Nail salons (service, art, length, shape)
- Auto detailers (vehicle, package, condition)

It's free. No account, no subscription, no catch. Takes 60 seconds to install.

Try the demo and grab the code: https://yarmoluk.github.io/shop-estimator/go.html

If you run a service business and want a custom config for your industry, let me know.

---

## r/tattooartists

**Title:** Built a free pricing estimator widget for tattoo shop websites — kills the "how much?" DMs

**Body:**

I built a free tool that sits on your shop's website and lets customers estimate their own tattoo price.

They pick size (coin, palm, hand, half sleeve, full sleeve, back piece), placement, style (fine line, traditional, realism, Japanese, etc), color, detail level, and whether it's a cover-up. Gets a price range based on YOUR rates, shows a session plan for big pieces, and has a "Get Your Exact Quote" button that goes to your booking page.

Your shop name, your colors, your rates. Nobody knows you didn't build it.

One line of code to install. Works on any website. Free forever.

Demo: https://yarmoluk.github.io/shop-estimator/go.html

I'm a developer, not a tattoo artist — so if the pricing logic is off or I'm missing something obvious about how shops actually price work, I'd love to hear it. Built this for a friend's shop and figured I'd open it up.

---

## r/webdev

**Title:** Built a config-driven pricing estimator engine — one JSON file spins up a full widget for any service vertical

**Body:**

Open source, zero dependencies, self-contained IIFE. You embed it with a single script tag and point it at a JSON config file that defines the vertical (steps, option groups, multipliers, toggles, products).

```html
<script src="engine.js" data-config="configs/tattoo.json" data-shop="My Shop" data-hourly="150"></script>
```

The engine reads the config, builds a multi-step form with progress dots, calculates pricing from chained multipliers, auto-flags multi-session jobs, and renders a results page with factor breakdown + booking CTA.

Currently have configs for tattoo shops, hair salons, nail salons, and auto detailers. Adding a new vertical is just writing a JSON file.

Tech: vanilla JS IIFE, all CSS scoped with `.te-` prefix, fetches config via fetch(), data-* attribute overrides for per-shop customization. ~25KB unminified.

Demo: https://yarmoluk.github.io/shop-estimator/go.html

Source: https://github.com/Yarmoluk/shop-estimator

Feedback welcome — especially on the config schema design. Trying to keep it flexible without overcomplicating it.
