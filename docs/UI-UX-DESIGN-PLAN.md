# UI/UX Design Plan — Certified Drone Pilots

**Branch:** `frontend`  
**Owner:** UI/UX (Md Mihran Sohail)  
**Status:** Planning only. No production code changes until this plan is approved.  
**Goal:** Take the existing AI-built product and give it a professional, handmade feel through consistency, usability, visual hierarchy, and a clearer user experience.

This document is the source of truth for how the product should look and feel before files are updated one by one.

---

## 1. Product in one sentence

A B2B marketplace where companies hire **verified commercial drone pilots** for industrial work (agriculture, inspection, mapping, surveying, construction), and pilots find paid missions after certificate verification.

It should feel like a **serious operations product**, not a sci-fi SaaS template.

**Closest references (spirit, not copy):** Stripe (clarity), Linear (density with restraint), AngelList / Wellfound (marketplace trust), Garmin / aviation ops tools (competence without neon glow).

**Not the reference:** generic dark-mode landing pages with cyan blobs, rainbow icon cards, and “Command Center” banners.

---

## 2. Design principles

1. **Quiet confidence.** Trust comes from layout, type, and verified status — not from glow, gradients on every button, or words like “industrial flight network.”
2. **One system, many pages.** Color, type, buttons, inputs, cards, and spacing are defined once and reused. Pages do not invent their own styles.
3. **Hierarchy before decoration.** Every screen answers: what is this, what matters, what do I do next.
4. **Readable first.** Body text is 14–16px. Labels are not microscopic. Contrast meets a professional bar.
5. **Role-honest.** Guest, Pilot, Company, and Admin see different jobs-to-be-done. The UI should not show company CTAs to guests or raw enums like `PILOT`.
6. **Handmade, not generated.** Fewer effects. Named brand. Human copy. Real empty states. Consistent spacing.
7. **Progressive, not theatrical.** Dashboards help people work. They are not “command centers.”

### Explicitly stop using

- Cyan glow blobs as a page background
- Gradient text on every headline
- `rounded-3xl` on everything
- Uppercase tracking labels on every section
- Copy: “Command Center”, “Operations Center”, “Precision Matching Engine”, “Sign In to Platform”
- Showing demo passwords on the public login screen (keep for internal/demo mode only)
- Rainbow-colored industry cards (emerald / pink / purple / amber all at once)
- Sci-fi HUD / radar maps unless a real map exists
- Tiny `text-xs` / `text-[10px]` as the default UI size

---

## 3. Brand

### Name in the UI

The current navbar name **CERTIFIED DRONE PILOTS** plus subtitle **Industrial Flight Marketplace** is too long and too template-like.

**Recommended product name:** **Aether**  
**Descriptor (used once, not in the logo lockup):** Commercial drone pilots for industry.

If the team must keep the legal name, use:

- **Logo lockup:** “Aether”
- **Small legal line in footer:** “Aether — Certified Drone Pilots”

If stakeholders reject a new name, use **Skywork** or keep **Certified Pilots** as a short lockup (title case, not all caps). Do not use ALL CAPS in the header.

### Logo

Keep the rotated navigation/compass mark, but simplify:

- One color mark on a quiet surface (no gradient ring + inner dark square + glow).
- 32×32 in the header, 40×40 on auth pages.
- Always paired with the wordmark except on very small mobile.

### Voice

- Short, specific, operational.
- Say “jobs”, “pilots”, “certificate”, “pay” instead of “missions”, “flight network”, “escrow milestone disbursements” unless that term is legally required.
- Buttons: verb + object. “Sign in”, “Create account”, “Post a job”, “Submit proposal”.

**Headline example (landing):**  
Hire verified drone pilots for inspection, mapping, and spraying.

**Not:**  
Connect With Certified Drone Professionals / FAA Part 107 Verified Commercial Flight Network.

---

## 4. Visual system

### 4.1 Color

Keep a dark product (it already fits aviation / night ops) but make it **calmer and more consistent**. Stop scattering hex values in every file. Use CSS variables, then Tailwind maps to those variables.

| Token | Role | Proposed value | Notes |
|---|---|---|---|
| `--bg` | App background | `#0B1018` | Slightly warmer than pure `#060b18` |
| `--surface` | Cards, dropdowns | `#121826` | One card color everywhere |
| `--surface-2` | Nested wells, inputs | `#0E141F` | Inputs sit slightly inset |
| `--border` | Default hairline | `#243044` | Visible, not invisible navy-on-navy |
| `--border-strong` | Active / hover | `#334155` | |
| `--text` | Primary text | `#E8EEF6` | Not pure white |
| `--text-muted` | Secondary | `#9AA8BC` | Body supporting text |
| `--text-subtle` | Captions | `#6B7A90` | Dates, meta |
| `--primary` | Actions, links | `#1FA8B8` | Teal-cyan, less neon than `#06b6d4` |
| `--primary-hover` | | `#178A97` | |
| `--primary-fg` | Text on primary | `#062226` | Dark, not white-on-cyan chaos |
| `--success` | Verified, paid | `#3D9A6A` | |
| `--warning` | Pending cert | `#C9922A` | |
| `--danger` | Errors, sign out | `#D45D5D` | |
| `--info` | Neutral status | `#5B8FD4` | Use sparingly |

**Rules**

- Primary is for **one** main action per view.
- Success green is for verified / complete only.
- Do not tint every KPI card a different rainbow color. Use the same surface; vary only the small icon.
- Admin can use a slightly cooler header accent, not a purple “admin theme” that looks like another product.

### 4.2 Typography

Load **one** font. Tailwind currently expects Inter but Inter is never loaded.

**Choice:** [Inter](https://rsms.me/inter/) via `next/font/google`.

Fallback: system UI.

| Role | Size | Weight | Line height | Use |
|---|---|---|---|---|
| Display | 36–48px | 600 | 1.15 | Landing hero only |
| H1 | 28–32px | 600 | 1.2 | Page titles |
| H2 | 20–22px | 600 | 1.3 | Section titles |
| H3 | 16–18px | 600 | 1.35 | Card titles |
| Body | 15–16px | 400 | 1.55 | Descriptions, forms |
| Label | 13–14px | 500 | 1.4 | Form labels |
| Caption | 12–13px | 400 | 1.4 | Meta, timestamps |
| Button | 14–15px | 600 | 1 | Button labels |

**Rules**

- Default UI text is **body or label**, not 11px.
- Maximum two weights on a screen (400 + 600). Avoid `font-black` / `font-extrabold` except maybe the landing hero.
- Do not use gradient fills on text except optionally once on the landing hero accent word — and even that is optional. Prefer solid `--text`.

### 4.3 Spacing and radius

Use an 8px grid: 8, 16, 24, 32, 48, 64.

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 8px | Inputs, small chips |
| `--radius-md` | 12px | Buttons, cards |
| `--radius-lg` | 16px | Auth card, large panels |

Do **not** use 24px (`rounded-3xl`) as the default. Slightly tighter radius feels more designed and less “AI card stack.”

Page padding: 16px mobile, 24–32px desktop. Content max width: **1120–1200px** for app pages, **720px** for reading (FAQ), **440px** for auth cards.

### 4.4 Elevation

Dark UI does not need drop shadows everywhere.

- Default card: surface + 1px border
- Hover: slightly stronger border, **no** lift + cyan glow
- Overlay (dropdown, modal): surface + border + soft shadow `0 16px 40px rgba(0,0,0,0.4)`
- Focus: 2px ring using `--primary` at ~40% opacity

### 4.5 Motion

- 150–200ms ease for hover/focus
- No pulsing match badges
- No spinning compass on maps
- Page content can fade in once; do not animate every card

### 4.6 Iconography

Stay with Lucide for speed, but:

- One size per context (16px inline, 20px nav, 24px empty state)
- Stroke width consistent
- Do not put a unique rainbow background behind every icon

---

## 5. Component library (build these first)

There is currently **no** Button / Input / Card. Every page pastes Tailwind. That is why the product looks generic and inconsistent.

Create a small set of shared components (suggested folder: `components/ui/`) **before** restyling pages.

### 5.1 Button

Variants: `primary` | `secondary` | `ghost` | `danger` | `link`  
Sizes: `sm` | `md` | `lg`  
States: default, hover, active, disabled, loading

**Primary:** filled `--primary`, dark label, no gradient.  
**Secondary:** transparent / surface, 1px border.  
**Ghost:** no border, muted text.  
**Danger:** for sign out / reject / cancel job.

Full-width only when the parent is a narrow form (auth). Do not make every dashboard button full-width.

### 5.2 Input, Textarea, Select

Shared anatomy:

- Label above (13–14px, `--text`)
- Optional hint below
- Error text in `--danger`, 13px
- Height ~44px (accessible tap target)
- Icon optional, inside left, muted
- Focus: border + ring, same on every field
- Placeholder: `--text-subtle`, never as tiny as 12px

Select and textarea must match input radius, background, and border.

### 5.3 Card

One `Card` with optional header / body / footer. Used for job cards, dashboard panels, form sections.

No unique glow border on “important” cards. Importance = typography and one primary button.

### 5.4 Badge / Status

Reuse and refine `StatusBadge`:

- Human labels: “Open”, “In progress”, “Verified” — never `PILOT_SELECTED` raw
- Small, 12–13px, pill, muted fill
- Match score: static badge, no pulse. Label: “92% match” with a short tooltip: “Based on certificate, location, equipment, and experience.”

### 5.5 Alert

`success` | `warning` | `error` | `info`  
Used for form errors, “proposal submitted”, “certificate pending.”

### 5.6 Modal / Dialog

Job apply, payment, review currently live as ad-hoc overlays in a huge page file. Extract one modal:

- Dimmed backdrop
- Esc and click-outside to close
- Title, body, footer actions (secondary left/cancel, primary right)
- Focus trap (at least: focus the first field)

### 5.7 Empty state, loading, skeleton

Keep `EmptyState` but:

- Body-size copy
- One secondary or primary action
- No sarcastic or overly technical empty copy

Loading: skeleton of the **actual layout**, not a generic spinner in the page center except on first auth load.

### 5.8 Navbar, Sidebar, Footer

These are layout, not page decoration.

**Navbar**

- Height 64px, sticky, `--bg` at high opacity + blur (keep)
- Left: mark + wordmark
- Center (guest): Jobs, Pilots, How it works
- Right (guest): Sign in (ghost) + Get started (primary)
- Right (signed in): Notifications, Dashboard (secondary), avatar
- Signed-in role as “Pilot” / “Company” / “Admin”, not `PILOT`
- Hide marketing links on dashboard routes if they compete with the sidebar (optional: show only wordmark + user)

**Auth pages:** either hide the global navbar **or** show a minimal bar (logo + “Sign in”). Do not stack full marketing nav + a second logo in the form.

**Sidebar**

- Same width (256px)
- Active: left accent bar or quiet fill, not cyan boxed outline + chevron
- Group labels: “Work”, “Account” instead of a single “Navigation”
- Mobile: top bar menu or a bottom sheet — **not** a floating cyan FAB covering content

**Footer**

- Public pages only (landing, jobs, pilots, job/pilot detail)
- Not inside dashboards
- Remove or build `/privacy`, `/terms`, `/safety` — do not leave dead links
- Short columns: Product, For pilots, For companies, Legal

---

## 6. Layout patterns

### Public page

```
[ Navbar ]
[ Page header: kicker optional, H1, one sentence, primary action ]
[ Content width 1120 ]
[ Footer ]
```

### Auth page

```
[ Minimal top: logo → home ]
[ Centered card 400–440px ]
[ Title, subtitle, form, footer link ]
[ No marketing footer, no demo wall unless demo mode ]
```

### Dashboard

```
[ Navbar: compact ]
[ Sidebar | Main ]
Main: H1 + short description + page action
Then: metrics (4, not 6 cramped cards) → primary list
```

### Marketplace list (jobs / pilots)

```
Header
Search row (always visible on mobile)
Filters: drawer on mobile, left column on desktop
Results + count
Cards
```

### Detail (job / pilot)

```
Back link
Title + status + meta
Two columns desktop: content 2/3, action rail 1/3
Action rail sticky on desktop
```

---

## 7. User experience by role

### Guest

1. Understand what the product is in 5 seconds.
2. Browse jobs and pilots without an account.
3. Sign up as **pilot** or **company** with a clear choice.
4. Never be sent to `/company/post-job` (protected) from a public “Post a job” button — send to register with `?role=COMPANY` instead.

### Pilot

1. After signup: complete profile + upload certificate (this is the real first job).
2. Browse jobs they can actually apply to; unverified pilots see **why** they cannot apply, with a link to certification.
3. Apply with proposal + bid.
4. Track applications, active work, pay, reviews.

### Company

1. After signup: company profile, then post a job.
2. Post job as a **stepped form**, not one endless page.
3. Review applicants, choose a pilot, track work, pay, review.

### Admin

1. First screen: pending certificates (the actual bottleneck).
2. Users, jobs, reports as tables with filters — not decorative charts first.

---

## 8. Screen-by-screen plan

Work **one surface at a time** after the system exists. Do not restyle 33 pages in one pass.

### 8.1 Design system (foundation)

**Files (later, when implementation starts):** `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx`, `components/ui/*`

**Done when:** a story-like usage is possible: primary/secondary buttons, a form with error, a card, a badge — all from shared components.

### 8.2 Login

**Purpose:** Get a returning user in quickly.

| Element | Direction |
|---|---|
| Title | Sign in |
| Subtitle | Use your email and password. |
| Fields | Email, password (show/hide toggle) |
| Primary | Sign in |
| Secondary | Forgot password · Create an account |
| Errors | Field-level if possible; otherwise one alert |
| Demo accounts | Hidden behind “Use a demo account” disclosure **or** only in development |

Remove the extra logo-in-card if a minimal header already has the logo. One brand moment per screen.

### 8.3 Sign up

**Purpose:** Create the right type of account without a wall of fields.

**Recommended two steps**

1. **Account:** I fly drones / I hire pilots · name · email · password  
2. **Details:** phone, city, state; if company: company name, industry

Keep role tabs, but style them as a segmented control (secondary surface, selected = primary text/border, not a full cyan fill that fights the submit button).

Copy: “Create your account” / “Join as a pilot or a company.”

Password: minimum rule shown as hint, not only after fail.

### 8.4 Forgot password

Match login exactly (same card, same button, same logo). Honest copy if reset is not implemented yet: “Password reset is not available yet. Contact support.” Do not fake a “recovery link generated” success if nothing was sent.

### 8.5 Landing

Structure can stay (hero → how it works → industries → trust → FAQ → CTA). Visual and copy change:

- Hero: one H1, one paragraph, two buttons (**Find a pilot**, **Browse jobs**). Secondary button is outline, not a third visual language.
- Remove or replace unverifiable stats (`$2.4M+`, `12,500+ hours`) unless the team confirms they are real. Prefer: “Part 107 verified before you hire” and a single proof point.
- How it works: two columns stay; use numbered list without nested glass cards inside glass cards.
- Industries: six cards, **same** surface and icon color; title + one line; link “See jobs”.
- FAQ: accordion (one open at a time) instead of four always-open blocks.
- Final CTA: “Post a job” (companies) and “Apply as a pilot”.

### 8.6 Jobs list

- H1: Jobs  
- Subtitle: Open commercial drone work.  
- Guest CTA: “Post a job” → register as company  
- Search always on mobile  
- Filters in a sheet/drawer on small screens (currently hidden)
- Card: title (H3), company, location, date, budget, status, one button **View job**
- Budget as body/H3, not `font-black` neon
- Result count: “12 jobs”

### 8.7 Job details

This is the product’s most important screen. Treat it like a hiring brief.

- Back to jobs  
- Title, status, service type  
- Meta row: company · location · date · budget  
- Sections: About the job · Requirements · Equipment · Location  
- Right rail: budget, dates, **one** primary action based on role:
  - Guest: Sign in to apply
  - Unverified pilot: Get verified to apply
  - Verified pilot: Submit proposal
  - Applicant: Your proposal + status
  - Company owner: View applications / Update status / Pay
- Map: static map or simple location block. If no API key, a clean address card — not a radar HUD.
- Modals use the shared Dialog.

Copy: drop “Mission Scope & Objectives”, “simulated escrow” in the customer-facing title (if payment is simulated, say “Payment (demo)” in caption).

### 8.8 Post a job

Turn the long form into **3 steps** with a progress indicator:

1. **Basics** — title, category, description, budget  
2. **When & where** — city, state, address, date, time, duration, deadline  
3. **Requirements** — certificate, years, equipment, extra rules  

Empty equipment/requirements lists start empty (or with placeholders the user can remove). Do not pre-fill DJI + thermal so every job looks identical.

Primary: “Publish job”. Secondary: “Save and back”.

### 8.9 Pilots list and pilot profile

Same list pattern as jobs. Cards: name, verified badge, location, specialties, rating. Profile: proof of certificate, equipment, reviews, contact/hire CTA for companies.

### 8.10 Dashboards (pilot, company, admin)

Shared template:

- Greeting: “Good morning, Alex” or “Overview”
- One sentence of context
- **Four** stats max (the sixth card is noise)
- One primary list (recommended jobs / your jobs / pending verifications)
- Charts only if they encode real data. Remove or label mocked spending/application charts.

Pilot: verification alert is the most important module if unverified — warning alert + link, not a giant gradient banner.

Company: “Post a job” is the page-level primary button.

Admin: pending certifications table first.

### 8.11 Tables and secondary app pages

Applications, earnings, users, certifications: **one table pattern**

- Header + filters
- Rows with consistent cell type (text, badge, money, actions)
- Empty state
- Row action: View

Settings and profiles: grouped cards, body-size inputs, Save as primary at the bottom (sticky on mobile if needed).

### 8.12 Notifications

Dropdown: 16px title, 14px body, time as caption. Unread = small dot, not a new color system. Close on outside click (already partly there) and Escape.

---

## 9. Usability checklist (apply on every page)

- [ ] Keyboard: tab order, visible focus
- [ ] Labels associated with inputs (`htmlFor` / `id`)
- [ ] Errors announced next to the field
- [ ] Buttons say what they do; disabled buttons explain why
- [ ] Touch targets ≥ 40px
- [ ] Contrast: muted text still readable on `--surface`
- [ ] Mobile: filters, sidebar, tables, and modals all work
- [ ] No dead links
- [ ] Protected routes: CTAs send guests to login/register with return URL
- [ ] Role labels are human (“Pilot”), never raw enums
- [ ] Loading and empty states exist
- [ ] Destructive actions confirm

---

## 10. Visual hierarchy rules (quick test)

On any screen, a new user should see in this order:

1. **Where am I?** (page title)
2. **What is the state?** (verified, open job, error)
3. **What should I do?** (one primary button)
4. **Details** (supporting text, meta, secondary actions)

If two elements both shout (gradient banner + gradient button + pulsing badge), hierarchy has failed.

---

## 11. Implementation order (how not to blunder)

Stay on branch **`frontend`**. Do not merge until a milestone is reviewable.

| Order | Milestone | What changes | What must not happen |
|---|---|---|---|
| 0 | This plan | Docs only | No app code |
| 1 | Tokens + layout font | `globals.css`, `tailwind.config.ts`, `app/layout.tsx` | Do not restyle all pages yet |
| 2 | UI primitives | `components/ui/button`, `input`, `card`, `alert`, `badge`, `dialog` | Do not one-off class strings |
| 3 | Auth | Login, register, forgot-password + optional hide marketing nav | Do not redesign landing in the same commit if it creates a huge diff |
| 4 | Shared chrome | Navbar, footer, sidebar | Keep routes working |
| 5 | Landing | `app/page.tsx` | Copy + layout, not new features |
| 6 | Jobs list + job detail | Marketplace core | Extract modals, fix guest CTA |
| 7 | Post job | Stepped form | Behavior stays the same |
| 8 | Pilot/company/admin dashboards | Shared dashboard header + fewer KPIs | Do not invent new metrics |
| 9 | Remaining pages | Profiles, settings, admin tables | Same components |
| 10 | Pass | Contrast, mobile, empty states, copy sweep | |

**Commit style (when coding starts):** one milestone per commit, e.g. `Add shared button and input components`, `Restyle login and register with design tokens`.

**Rule:** If a page needs a new visual pattern, add it to `components/ui` first, then use it. Do not paste a new gradient into one file.

---

## 12. Acceptance criteria (what “handmade and professional” means)

The redesign is successful when:

1. Login and sign up look like the same product as the jobs page.
2. A designer could describe the type scale and button styles without opening 10 files.
3. Body copy is readable at arm’s length on a laptop.
4. Mobile jobs filters are usable.
5. Guests are never dumped on a login wall by a “Post a job” button without explanation.
6. Verified status is the trust signal — not glow and fake stats.
7. Someone on the team can use the UI without noticing “AI template” tropes (blobs, rainbow icons, command-center banners, 11px labels).

---

## 13. Out of scope (for this UI/UX pass)

- New backend features
- Real map provider unless a key already exists
- Real password-reset email (unless backend is ready — UI should stay honest)
- Rebranding legal entity without team agreement (UI name can still shorten)
- Animation-heavy marketing
- Rewriting matching algorithm or charts’ data sources (except hiding obviously fake chart numbers)

---

## 14. Open questions for the team

1. Is a short product name (**Aether** / **Skywork**) acceptable, or must the full legal name stay in the header?
2. Are landing stats (`$2.4M+`, `12,500+` hours, `4.9` rating) real? If not, they should be removed.
3. Should demo logins stay on production login or only in development?
4. What is the deployed URL for a live walkthrough (guest, pilot, company, admin, mobile)?
5. Is password reset planned this internship, or should the page be an honest “not available”?

---

## 15. How this maps to the internship brief

| Brief | Plan |
|---|---|
| Reduce generic AI-generated feel | Quiet color, one type scale, no glow recipe, human copy |
| Professional, human-designed | Stripe-like restraint, operational language |
| Consistency | Tokens + `components/ui` first, then pages |
| Usability | Auth steps, mobile filters, honest CTAs, focus, empty states |
| Visual hierarchy | One primary action, readable type, fewer competing accents |
| Overall UX | Role-based jobs-to-be-done, job detail as the core, verification as the pilot’s first task |

---

*Planning document only. Application source files are unchanged until implementation starts on `frontend`.*
