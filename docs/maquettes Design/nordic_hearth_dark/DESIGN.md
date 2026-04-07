# Design System Specification: Scandinavian Noir Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Midnight Hearth"**

This design system is a study in quiet confidence. Moving beyond standard dark mode—which often feels like an inverted afterthought—this system treats the UI as a high-end editorial piece. It is inspired by the stark, atmospheric landscapes of the North: deep volcanic stone, charcoal embers, and the soft, resilient sage of lichen.

To move beyond the "template" look, we prioritize **intentional asymmetry** and **tonal depth**. We reject the rigid, boxed-in nature of traditional web design in favor of expansive breathing room and overlapping elements. Text is not just content; it is a structural element. Large-scale typography should feel architectural, anchoring the "weight" of the screen while the sage green accents provide a warm, human pulse within the cold stone environment.

---

## 2. Color Strategy: Tonal Sophistication
Our palette is rooted in the earth. The transition from `#121412` (Background) to `#333533` (Surface Highest) provides a sophisticated range of depths that mimic natural light falling on matte surfaces.

### The "No-Line" Rule
**Lines are a failure of hierarchy.** Designers are prohibited from using 1px solid borders to define sections. Instead, use background shifts. 
*   *Application:* A `surface-container-low` (`#1A1C1A`) section should sit directly against a `surface` (`#121412`) background. The distinction is felt, not drawn.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine-milled paper.
*   **Base:** `surface` (#121412) for the primary background.
*   **The Well:** Use `surface-container-lowest` (#0D0F0D) for inset areas like search bars or code blocks.
*   **The Lift:** Use `surface-container-high` (#282A28) for elevated cards or navigation bars.

### The "Glass & Gradient" Rule
To add soul to the dark mode, use the **Sage Gradient** for primary CTAs: 
*   *Linear Gradient (135deg):* `primary` (#B2CDBB) to `primary-container` (#8FA998).
*   *Glassmorphism:* For floating overlays (modals/dropdowns), use `surface-container-highest` at 80% opacity with a `24px` backdrop-blur. This allows the underlying sage accents to "bleed" through softly.

---

## 3. Typography: The Manrope Editorial
Manrope’s geometric yet humanist structure provides the "Modern Scandinavian" feel. We use a high-contrast scale to create an editorial rhythm.

*   **Display (lg/md/sm):** Use for hero moments. Tighten letter-spacing by `-0.02em`. These should feel like headlines in a premium architecture magazine.
*   **Headline & Title:** Use for section anchors. Always prioritize `on-surface` (#E2E3DF) for maximum legibility.
*   **Body (lg/md):** Our primary reading experience. Use `on-surface-variant` (#C2C8C2) for long-form text to reduce eye strain, reserving the brighter `on-surface` for emphasis.
*   **Labels:** Always uppercase with `+0.05em` tracking when used for utility or overlines to maintain an authoritative, curated feel.

---

## 4. Elevation & Depth
In this system, light comes from within the components, not from an external source.

*   **The Layering Principle:** Avoid shadows for static cards. Instead, place a `surface-container-highest` card atop a `surface` background. The contrast in value creates the "lift."
*   **Ambient Shadows:** For floating elements (Modals/FABs), use a multi-layered shadow: 
    *   `0px 12px 32px rgba(0, 0, 0, 0.4)` combined with a subtle tint shadow `0px 4px 8px rgba(143, 169, 152, 0.05)`.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility (e.g., in high-glare environments), use `outline-variant` (#424844) at **15% opacity**. It should be a whisper, not a shout.

---

## 5. Components

### Buttons: The Tactile Sage
*   **Primary:** A solid fill of the Sage Gradient. Text color is `on-primary` (#1E3529). Radius is `DEFAULT` (0.5rem/8px).
*   **Secondary:** An "Invisible" button. Use `surface-container-highest` as the background. No border.
*   **Tertiary:** Pure text in `primary` (#B2CDBB) with a subtle underline on hover.

### Cards & Lists: The No-Divider Standard
*   **Cards:** Never use borders. Use `surface-container` tiers. Content within cards should be separated by a minimum of `24px` (1.5rem) of whitespace.
*   **Lists:** Prohibit divider lines. Use a `4px` vertical sage accent line on the left of a list item to indicate the `hover` or `active` state.

### Input Fields: Inset Depth
*   **Surface:** Use `surface-container-lowest` (#0D0F0D) to create a "hollowed out" effect. 
*   **Active State:** Change the `outline` to `primary` (#B2CDBB) at 50% opacity. The cursor should always be the signature Sage.

### Signature Component: The Editorial Ghost Header
A large `display-lg` title that is partially clipped by a `surface-container` image or card, creating a sense of depth and layered physical media.

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme whitespace. If you think there is enough space, add 16px more.
*   **Do** use the `primary-fixed-dim` (#B2CDBB) for icons to give them a soft, glowing presence.
*   **Do** lean into asymmetry. Align a headline to the left and the body text to a column on the right.

### Don't
*   **Don't** use pure black (#000000). It kills the "Stone" aesthetic and causes ghosting on OLED screens.
*   **Don't** use 100% white for text. Use `on-surface` (#E2E3DF) to maintain the premium, soft-touch feel.
*   **Don't** use standard shadows. If the background shift isn't enough, reconsider the layout before reaching for a drop shadow.
*   **Don't** use high-saturation greens. Only use the specified Sage (#8FA998) to ensure the "Nordic" restraint is maintained.