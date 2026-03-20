# Apple HIG design review checklist

Use this after **any** portfolio UI change (layout, typography, spacing, color, motion, navigation).  
Official reference: **[Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)** (Apple Developer Documentation).

## Layout & spacing

- [ ] **8pt grid**: margins and padding use multiples of **8px** (e.g. 8, 16, 24, 32, 40, 48, 64) via shared tokens (`--space-*`, `--section-gap`).
- [ ] **Consistent section rhythm**: space **between** major sections matches `--section-gap`; space **inside** blocks (heading → content) uses `--section-block-gap` or equivalent.
- [ ] **Safe areas**: `env(safe-area-inset-*)` respected on notched devices for hero, tab bar, and fixed UI.
- [ ] **Readable widths**: line length and `max-width` on text blocks stay comfortable (no full-bleed body copy on large screens).

## Typography

- [ ] **Hierarchy**: title / headline / body / caption roles are clear; avoid arbitrary font-size jumps.
- [ ] **System stack**: primary UI uses system/SF stack (`--font-sans` / `--font-display`); web fonts only where intentional.
- [ ] **Legibility**: contrast meets **WCAG AA** on light and dark surfaces; test `prefers-contrast` / forced colors if you add effects (e.g. gradient text).

## Color & materials

- [ ] **Semantic use**: accent for actions and focus; muted for secondary text; borders use `--line` / `--line-strong`.
- [ ] **Dark Mode**: `data-theme`, `prefers-color-scheme`, and system-default (auto) behave consistently.
- [ ] **Materials**: blur/surfaces don’t harm readability or focus order.

## Touch & input

- [ ] **Minimum targets**: interactive controls ≥ **44×44 pt** (or documented exception with extra padding).
- [ ] **Focus**: `:focus-visible` outlines visible for keyboard; modals/sheets trap focus appropriately.
- [ ] **Motion**: respect **`prefers-reduced-motion`** for non-essential animation.

## Navigation & structure

- [ ] **Predictable navigation**: primary destinations reachable from header or tab bar; current page indicated (`aria-current` where applicable).
- [ ] **Labels**: icons paired with text or `aria-label` where meaning isn’t obvious.

## Content

- [ ] **Accuracy**: copy matches resume/case study facts; links open safely (`rel` on external).
- [ ] **Images**: meaningful `alt` text; hero/object-fit doesn’t crop faces awkwardly after layout changes.

---

**Staging:** preview locally from repo root; see `docs/staging.md`.
