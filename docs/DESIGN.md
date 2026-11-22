# Design guide: «Cómic refinado»

English · **[Español](es/DESIGN.md)**

Every screen follows this guide. It builds on the comic-workbook style already in
`src/index.css` (`.tp-card`, `.tp-button`, `.tp-kicker`, `.tp-lesson-heading-*`).

## 1. Principles

1. **Ink and paper.** Cream background, black ink lines, hard offset shadows. No
   blur shadows, gradients, glassmorphism or emoji.
2. **Color has meaning.** Each content type always uses the same color (section 5).
   Never use color only for decoration.
3. **Reading first.** Long text sits in a calm column no wider than 840px. The
   heavy comic style goes on headers, cards and buttons, not on paragraphs.
4. **Spanish UI.** All visible text is in Spanish (Mexico): «Ver solución»,
   «Guardar en lista», «Responder», «Reportar».

## 2. Color tokens

These are CSS variables in `src/index.css` (Tailwind v4 `@theme`). Use the
tokens, not raw hex values, in components.

| Token | Hex | Use |
| --- | --- | --- |
| `--tp-paper` | #FAF8F5 | Page background |
| `--tp-surface` | #FFFFFF | Cards, forms, nav |
| `--tp-ink` | #111111 | Text, borders, shadows |
| `--tp-ink-muted` | #5F5C57 | Secondary text (meets 4.5:1 on paper and white) |
| `--tp-ink-soft` | #46433F | Proof notes and captions |
| `--tp-rule` | #C4BCB2 | Dashed dividers |
| `--tp-violet` | #6D3EE8 | Primary action, active nav, progress, theorem label (white text) |
| `--tp-violet-soft` | #EEE7FF | Theorem background, comment box tool buttons |
| `--tp-sky` | #86D7FF | Page header band, definition label |
| `--tp-sky-soft` | #E5F1FF | Definition background |
| `--tp-yellow` | #FFD65A | Kickers, practice cards, «Problema del día» box |
| `--tp-yellow-soft` | #FFF4CC | Tips and hints |
| `--tp-mint` | #8EE8BF | «Resolver» / «Completado» actions, example header |
| `--tp-mint-soft` | #D8F5E8 | Related problems panel |
| `--tp-orange` | #FF9F43 | The penguin's orange: Error común label, report states, «¡Hoy!», «Próximamente», the 404 page |
| `--tp-orange-soft` | #FFE9D2 | Error común background |

Section heading backgrounds rotate in this order: #E8DDFF, #D9F1FF, #FFE2C4,
#D8F5E8 (`.tp-lesson-heading-0…3`).

**Contrast rule:** white text only on `--tp-violet` or `--tp-ink`. On every other
color, use `--tp-ink`.

## 3. Typography

Fonts load from Google Fonts in `index.html`:

- **Display:** Bricolage Grotesque 800 (h1, h2, h3, logo, card titles), with
  `letter-spacing: -0.02em` on h1.
- **Body:** Inter 400/500/600/700/800.
- **Math:** KaTeX. Never fake math with fonts.
- **Reading text (lessons, problem statements):** the math font, so text and
  formulas match. Use KaTeX's bundled `KaTeX_Main` with a serif fallback, 18px / 1.7.
  The interface stays in Inter and headings stay in Bricolage.

| Role | Size / line height | Weight |
| --- | --- | --- |
| h1 (page title) | 44px / 1.05 (34px on mobile) | 800 display |
| h1 (problem title) | 36px / 1.1 | 800 display |
| h2 (section) | 24px / 1.2 | 800 display |
| h3 / card title | 19–22px / 1.3 | 800 display |
| Lead paragraph | 17px / 1.65 | 400 |
| Body (reading) | 18px / 1.7, math font (`KaTeX_Main`) | 400 |
| Body (interface) | 15px / 1.55 | 400–600 |
| Meta / breadcrumbs | 13–14px | 600, muted |
| Kicker / box label | 11px, uppercase, letter-spacing 0.12–0.14em | 800 |

## 4. Shape, borders, shadows, spacing

| Element | Border | Radius | Shadow |
| --- | --- | --- | --- |
| Hero card (`.tp-card`) | 3px ink | 18px | 6px 6px 0 ink |
| Standard card / box (`.tp-card-soft`) | 2px ink | 14px | 4px 4px 0 ink, or none for quiet boxes |
| Button (`.tp-button`) | 2px ink | 12px | 4px 4px 0 ink; hover lifts to 6px; active presses to 2px |
| Pill / tag | 2px ink | 999px | none |
| Section heading | 2px ink | 10px | 3px 3px 0 ink |
| Inputs | 2px ink | 10px | none; focus = 2px violet outline, 3px offset |

- Spacing scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 64px. Card padding is 18–28px.
  Gaps between article blocks are 26px.
- Layout: content max-width 1120px, 24px side padding. Reading column max 840px.
  Sidebar 260–300px; it wraps below the content on mobile and is never sticky.
- Touch targets are at least 44px tall.
- Avatars are circles with a 2px ink border and a pastel fill. Users will pick
  from preset avatars only (no uploads).

## 5. Theory content blocks (one style per type)

These are React components in `src/components/content/` (`Bloques.jsx`,
`PracticeBox.jsx`). Authors pick a block type in the lesson text (see
[CONTENT.md](CONTENT.md#lessons-teoría)); they never style a box by hand.

| Component (block) | Label (pill) | Background | Border / shadow | Notes |
| --- | --- | --- | --- | --- |
| `Definicion` (`definition`) | DEFINICIÓN on sky | sky-soft | 2px, 4px shadow | |
| `Teorema` (`theorem`) | TEOREMA · name, on violet with white text | violet-soft | **3px, 6px shadow** (strongest box) | Display formula centered |
| `Enunciado` (`lemma`, `corollary`, `proposition`) | name on violet-soft | white | 2px, no shadow | Optional "Idea:" line in ink-soft |
| `Demostracion` (`proof`) | `<details>` summary «Demostración» | white | 2px **dashed** | Ends with a right-aligned ∎; open by default in lessons |
| `Ejemplo` (`example`) | mint header strip «EJEMPLO n» | white | 2px | Numbered automatically. Statement visible; solution hidden behind «Ver solución» |
| `Intentalo` (`try`) | `<details>` «Inténtalo: …» | white | 2px, 4px shadow | Answer hidden until opened |
| `Consejo` (`tip`) | CONSEJO DE OLIMPIADA on yellow | yellow-soft | 2px | |
| `ErrorComun` (`mistake`) | ERROR COMÚN on orange | orange-soft | 2px | |
| `PracticeBox` (problem boxes) | PRACTICA, EJERCICIOS or RETO on ink (white text) + «N problemas para esta lección» | **yellow** | 3px, 6px shadow | One box per kind, with compact white rows: meta (level · comments), statement preview (no title), mint «Resolver →». Points to the problem in the bank; never copies it |
| `Tabla` | none | white, header row #F2EFE9 | 2px, radius 12px | Scrolls sideways on mobile |
| `Figura` | none (caption below, Inter 13px) | white | 2px, radius 14px | SVG max 480px, centered. Ink lines 2.5px, one accent (violet) for what the text points at, labels in the math font, parallel lines with arrows, equal angles with the same letter. Several figures of one idea sit in a row and stack on mobile. Alt text required |
| `AgregadosCulturales` | none (section heading only) | white | 2px, no shadow | One card per bullet |

Geometry and any spatial argument always get a figure, placed right before the
paragraph that uses it.

## 6. Page patterns

- **Page header band:** full-width sky band (edge to edge, 3px ink bottom border,
  no card frame), yellow kicker (e.g. «TEORÍA · CICLO 1 · LECCIÓN 2»), h1, lead,
  meta ribbon (reading time, level, number of practice problems).
- **Logo:** text only, «TeacherPeri», Bricolage Grotesque 800, 22px,
  letter-spacing -0.02em. No box, no icon.
- **Navbar:** white, 3px bottom border. «Entrar» is a mint button with ink text
  and a 4px ink shadow. Order: Inicio, Rutas, Entrenamiento,
  Experiencias, Equipo, then the avatar (or «Entrar»). The active item has a 3px
  violet underline. On mobile it collapses into a menu button.
- **Breadcrumbs:** 14px muted. Inside a Ruta, show the Ruta path.
- **No sidebars on reading pages.** «En esta lección» is a row of pill links
  under the header band. Ruta context (opened with `?ruta=`) adds a white «En la
  Ruta» strip under the band (progress bar 12px, 2px border, violet fill),
  «Marcar paso como completado» in mint, and «Paso anterior / Siguiente paso».
  Opened from a library, none of these show.
- **Practice problems in a lesson:** one yellow «PRACTICA» box with compact rows
  (meta, statement, «Resolver →»). Problems never show titles.
- **Previous / next:** two white cards under a dashed divider.
- **Empty states and «Próximamente»:** a white `.tp-card-soft` with a yellow
  kicker and one sentence. No illustration is needed.

## 7. Comments

- A white card holds each top-level thread. Replies indent 52px per level, up to
  3 levels. After that, replies stay at level 3.
- Each row: avatar, **username**, role badge (violet-soft pill: Editor, Admin),
  muted time, the body (KaTeX for `$...$`), then «Responder» and «Reportar»
  (muted) as text buttons.
- Comment box: label «Escribe un comentario», textarea with placeholder «Usa $...$
  para escribir matemáticas», tool buttons in violet-soft («$ LaTeX»; «@
  Mencionar» and «Enlazar problema» are planned), and an ink «Publicar» button on
  the right.
- A deleted comment leaves a muted line: «Comentario eliminado por moderación».

## 8. Accessibility (required)

- Use real `<button>`, `<a href>`, `<label>` + `<input>`. Never put `onClick` on a
  `div`.
- Text contrast is at least 4.5:1. Icon-only buttons get an `aria-label`.
- Keep `:focus-visible` (2px violet outline). Respect `prefers-reduced-motion`
  (already in `index.css`).
- Every page works at 375px width: grids stack, tables scroll, navbar collapses.

## 9. Don'ts

- No new colors, fonts or shadow styles outside this guide.
- No blur shadows, gradients, emoji or tilted cards.
- No colored left-border-only callouts. Boxes use full borders as in section 5.
- Don't put heavy borders on long paragraphs. Keep reading text calm.
