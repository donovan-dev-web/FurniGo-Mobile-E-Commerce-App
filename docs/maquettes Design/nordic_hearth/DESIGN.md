# Design System Specification: High-End Scandinavian Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Curated Sanctuary."** 

Moving beyond the sterile "minimalism" of standard e-commerce, this system adopts a high-end editorial lens. It treats the interface not as a grid of products, but as a digital magazine where furniture breathes. We break the traditional "template" look through **intentional asymmetry**, large-scale typography, and **overlapping elements** (e.g., a chair silhouette breaking the container of a card). This approach signals craftsmanship and evokes the tactile quality of a physical furniture showroom.

---

## 2. Colors
Our palette avoids the harshness of pure black and white, opting instead for a "warm-light" spectrum that mimics natural wood and linen.

### Surface Hierarchy & Nesting
We utilize a "Tonal Depth" strategy. Instead of using lines to separate content, we use the following hierarchy:
- **Base Layer:** `surface` (#f9f9f9) — The canvas for the entire app.
- **Sectioning:** `surface-container-low` (#f2f4f4) — Used for large structural blocks (e.g., the background of a "New Arrivals" section).
- **Interactive Elements:** `surface-container-lowest` (#ffffff) — Used for cards and input fields to make them "pop" against the warmer base.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts or subtle tonal transitions. A `surface-container-low` section sitting on a `surface` background provides all the definition a high-end user needs.

### Glass & Signature Textures
- **Glassmorphism:** For floating navigation bars or quick-view modals, use `surface` at 80% opacity with a `20px` backdrop blur. This creates a "frosted glass" effect that keeps the user grounded in the beautiful furniture photography beneath.
- **Signature Gradients:** For primary CTAs, use a subtle linear gradient from `primary` (#4c6455) to `primary-dim` (#405849). This adds "soul" and depth, preventing the UI from looking like a flat prototype.

---

## 3. Typography
The typography is a dialogue between the structural **Manrope** (Display/Headlines) and the functional **Inter** (Body/Labels).

- **Display & Headline (Manrope):** These are our "Editorial" voices. Use `display-lg` for hero statements with tight letter-spacing. The generous x-height of Manrope conveys authority and modern elegance.
- **Body & Title (Inter):** Inter is chosen for its exceptional readability at small scales. It handles technical furniture specifications and pricing with a clean, trustworthy "Swiss" feel.
- **Hierarchy Note:** Large `headline-lg` titles should often be paired with `body-sm` metadata to create a high-contrast, premium "luxury" scale that standard apps avoid.

---

## 4. Elevation & Depth
Depth in this system is organic, not artificial. We mimic how light falls in a well-lit Scandinavian home.

- **The Layering Principle:** Stacking is our primary tool. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.
- **Ambient Shadows:** When an element must float (e.g., a "Add to Cart" fab), use a shadow with a `32px` blur and `4%` opacity. The shadow color must be a tinted version of `on-surface` (#2d3435), never pure black.
- **The "Ghost Border" Fallback:** If a boundary is strictly required for accessibility, use the `outline-variant` token at **15% opacity**. This "Ghost Border" provides a hint of structure without the visual clutter of a hard line.

---

## 5. Components

### Buttons
- **Primary:** High-contrast `primary` background with `on-primary` text. Use `xl` (1.5rem/24px) corner radius.
- **Secondary:** `secondary-container` background. This provides a warm, "wood-tone" alternative for secondary actions like "Add to Wishlist."
- **Tertiary:** No background; `on-surface` text with a bold weight. Used for "View All" or "Read More."

### Input Fields
- **Container:** Use `surface-container-lowest` with a `md` (0.75rem/12px) radius.
- **State:** No border on idle. On focus, use a `2px` "Ghost Border" using the `primary` color at 40% opacity.

### Cards & Lists
- **Strict Rule:** No dividers. Separate list items using `16px` of vertical white space or by alternating background tones (`surface` vs `surface-container-low`).
- **Product Cards:** Use `xl` (24px) corners on the image container. Text should be left-aligned with ample padding (min `24px`) to feel like a gallery label.

### Context-Specific: "The Material Drawer"
A unique component for this system—a bottom sheet using `surface-bright` and Glassmorphism that allows users to swap fabric textures or wood finishes on a product without leaving the editorial view.

---

## 6. Do's and Don'ts

### Do
- **Do** use "Negative Space" as a design element. If a screen feels full, add `16px` of padding to everything.
- **Do** allow furniture photography to bleed off the edge of the screen to create a sense of scale.
- **Do** use `primary-fixed-dim` for subtle accent backgrounds behind product cutouts.

### Don't
- **Don't** use 100% black (#000000) for text. Use `on-surface` (#2d3435) to maintain the "warm" aesthetic.
- **Don't** use "Drop Shadows" on cards. Rely on tonal layering (Surface Tiers) first.
- **Don't** use sharp corners. Every interactive element must utilize the `DEFAULT` (8px) to `xl` (24px) roundedness scale to feel "cozy" and safe.