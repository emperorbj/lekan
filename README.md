# Lekan — web frontend

The landing page and chat interface for **Lekan**, a personal AI assistant for Gmail, Google Calendar and Google Drive that **asks before it acts**: it reads freely, but anything that would change your data waits for your approval.

This repository is the frontend only. It talks to the separate Lekan backend (FastAPI) over HTTP. The backend's full API contract is in [`docs/API.md`](docs/API.md).

---

## Contents

- [What's inside](#whats-inside)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [How it works](#how-it-works)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)

---

## What's inside

### Landing page

A single page (`app/page.tsx`) made of these sections:

| Section | What it shows |
|---|---|
| **Hero** | Headline, calls to action and a looping scripted demo of a real conversation: Lekan searches Gmail, checks Calendar, proposes two changes, they get approved, and it replies with links |
| **Integrations** | Gmail, Calendar, Drive and Docs, and what Lekan can do in each |
| **Capabilities** | A card per app, each with a small animated preview |
| **Approvals** | An interactive approval card: visitors can approve, edit or decline and see how Lekan responds |
| **How it works** | Connect Google → ask in plain language → approve |
| **Trust** | The deliberate limits: read-only Gmail, no deletes, invites flagged, local history, sanitised replies |
| **FAQ** and **final call to action** | The final prompt box opens the chat and sends the visitor's question |

Animations are subtle and respect the operating system's *reduce motion* setting. Light and dark themes are both supported. The theme follows the system and can be toggled from the header or with the `d` key.

### Chat widget

A floating chat bubble (bottom right) opens a chat panel, full-screen on phones, that talks to the real backend:

- **Connection status** in the header: server reachable, Google connected or not.
- **Connect Google**: opens Google sign-in in a new tab and checks `/auth/status` every 2.5 s until the account is connected.
- **Messages** rendered as sanitised Markdown. Links to Google Calendar, Docs, Sheets, Slides, Drive and Gmail become chips with the right brand icon.
- **Approval cards** for every action that changes data (create event, create doc, create folder, rename, move, upload). Each card can be **approved**, **edited** (a form per action type) or **declined with a reason**. Several pending actions are collected and submitted together, in order, as the API requires. Events that will email guests show a clear warning.
- **Thinking state** with a Lottie animation and a status line matched to the request ("Checking your calendar…"). After about 12 s it explains that bigger requests can take up to a minute.
- **Error handling** for every case in the API guide: offline server, 500s, the "still waiting for approval" 409, expired approvals, with a **Retry** button on failed messages.
- **Empty state** with suggested prompts and an "Up next" list from your calendar.
- **History** saved in `localStorage`, because the backend doesn't store messages. **New chat** starts a fresh conversation.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui tokens, Base UI |
| HTTP | [axios](https://axios-http.com), wrapped in one API client |
| Server state | [TanStack React Query v5](https://tanstack.com/query) |
| Animation | [Motion](https://motion.dev) (`motion/react`) |
| Loaders | [lottie-react](https://github.com/Gamote/lottie-react) (animations built as code, see `lib/lottie`) |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-sanitize` |
| Icons | `lucide-react` (UI) and `react-icons/si` (Google brand icons) |
| Fonts | Instrument Serif (headings), Geist and Geist Mono (body), via `next/font` |
| Theme | `next-themes` |
| Package manager | Yarn 4 (Plug'n'Play) |

---

## Getting started

### Prerequisites

- **Node.js 20+** (developed on Node 24)
- **Yarn 4**: enable it with `corepack enable`
- A running **Lekan backend**, locally (`http://localhost:8000` by default) or deployed

### Install and run

```bash
git clone https://github.com/emperorbj/lekan.git
cd lekan
yarn install

cp .env.example .env.local     # then set LEKAN_API_URL (see below)
yarn dev
```

Open <http://localhost:3000>, click the chat bubble, and press **Connect** to link your Google account.

---

## Environment variables

Create `.env.local` in the project root. It's git-ignored; `.env.example` is the committed template.

| Variable | Required | Default | Description |
|---|---|---|---|
| `LEKAN_API_URL` | Yes | `http://localhost:8000` | Base URL of the Lekan backend. Used by the server-side `/api` proxy (see [How it works](#the-api-proxy)) |
| `NEXT_PUBLIC_API_BASE_URL` | No | `/api` | Only set this if the backend has CORS enabled for your frontend's origin and you want the browser to call it directly instead of through the proxy |

```env
# .env.local
LEKAN_API_URL=https://your-backend.example.com
```

> **Restart `yarn dev` after changing `.env.local`.** `next.config.ts` reads it only when the server starts.

---

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Start the dev server on port 3000 |
| `yarn build` | Production build |
| `yarn start` | Serve the production build |
| `yarn lint` | ESLint |
| `yarn typecheck` | TypeScript, no emit |
| `yarn format` | Prettier, with Tailwind class sorting |

`dev` and `build` use `--webpack` on purpose. Turbopack, the Next 16 default, can't resolve packages under Yarn Plug'n'Play. See [Troubleshooting](#troubleshooting).

---

## How it works

### The API proxy

The backend doesn't enable CORS, so a browser on another origin can't call it directly. The frontend calls its own `/api/*` instead, and a Next.js rewrite forwards those requests to the backend:

```
Browser ──▶ http://localhost:3000/api/chat ──(Next.js rewrite)──▶ ${LEKAN_API_URL}/chat
```

Configured in [`next.config.ts`](next.config.ts). Two details matter:

- `experimental.proxyTimeout` is raised to **120 s**. A chat turn can take up to 60 s while the agent calls Google tools, and the default proxy timeout is 30 s.
- If the proxy can't reach the backend, Next.js answers **`500 Internal Server Error`**. That's what you'll see when `LEKAN_API_URL` is wrong or the backend is down.

### Data layer

Requests go through four layers, each with one job:

```
components  ──▶  hooks (React Query)  ──▶  services  ──▶  lib/api/client (axios)
```

- **`lib/api/client.ts`**: the axios instance (base URL `/api`, 120 s timeout). An interceptor turns every error shape from the API guide into a single `ApiError { message, status, kind }`: FastAPI `detail` strings, 422 validation arrays, plain-text 500s, network failures and timeouts. Components can always show `error.message` directly.
- **`services/*.service.ts`**: one typed function per endpoint (`authService`, `chatService`, `googleService`).
- **`hooks/*`**: React Query wrappers. `useHealth`, `useAuthStatus` and `useConnectGoogle` handle connection state, `useUpcomingEvents` and friends fetch Google data, and `useChat` handles the conversation.
- **`lib/api/types.ts`**: TypeScript types that mirror `docs/API.md` §11.

### The chat flow

`hooks/use-chat.ts` implements the state machine from `docs/API.md` §10:

```
            POST /chat
  IDLE ─────────────────▶ THINKING ──▶ reply ───────────────▶ IDLE
                              │
                              └──▶ pending_approvals ──▶ AWAITING_APPROVAL
                                                             │  user decides
                                                             ▼
                                                    POST /chat/approve
                                                    ├─ reply            → IDLE
                                                    └─ more approvals   → AWAITING_APPROVAL
```

- The input is disabled while thinking or awaiting approval, and only one request per thread is in flight.
- The `thread_id` from each response is stored and sent with the next message. **New chat** clears it.
- The transcript lives in a small external store (`lib/chat/store.ts`) persisted to `localStorage` and read with `useSyncExternalStore`, so it survives reloads without hydration mismatches. Mutation callbacks live on the mutation options, so a reply that arrives after the panel is closed still lands in the transcript.
- After an approval succeeds, Google queries are invalidated so widgets like "Up next" refresh.

| Situation | What the UI does |
|---|---|
| `409` on `/chat` | Points to the pending card, or asks you to start a new chat if the card isn't on this device |
| `400 "Nothing is waiting…"` on `/chat/approve` | Marks the card *Expired* (for example after a server restart) |
| Any other approval error | Reopens the card so you can resubmit |
| Failed send | Error bubble with **Retry** |

### Approval cards

[`components/chat/tool-meta.ts`](components/chat/tool-meta.ts) describes each approval tool: label, brand icon, headline and editable fields. [`approval-card.tsx`](components/chat/approval-card.tsx) builds a friendly summary from `tool` and `args`. It never shows the raw `description`, as the API guide advises.

- **Edit** sends the *complete* argument object, as the API requires. Opaque Drive IDs are kept but not editable.
- Calendar times are local wall-clock strings (`"2026-11-23T15:00"`) and are shown as-is, never converted from UTC (see `lib/format.ts`).
- Unknown tools fall back to a generic card that shows their arguments, so new backend tools still work.

### Connecting Google

The OAuth callback returns JSON instead of redirecting back to the app, so:

1. **Connect** opens `/api/auth/google` in a new tab. The proxy passes Google's redirect through.
2. The user signs in. Google redirects to the **backend's** callback, which says "You can close this tab".
3. Meanwhile the chat checks `/auth/status` every 2.5 s, and again when the window regains focus, until it's connected.

---

## Project structure

```
app/
  layout.tsx            Fonts, metadata, providers
  page.tsx              Landing page: composes the sections
  providers.tsx         React Query, theme, Motion config, chat provider
  globals.css           Design tokens (light and dark), utilities, keyframes
  icon.svg, favicon.ico, apple-icon.png

components/
  brand/                Logo and Google brand icons (+ URL → brand detection)
  chat/                 Chat widget: provider, launcher, panel, header,
                        connection banner, messages, approval cards,
                        composer, Markdown, thinking indicator
  landing/              Landing page sections + shared primitives (Reveal, …)
  lottie-player.tsx     Client-only Lottie wrapper
  theme-provider.tsx    next-themes + `d` hotkey
  ui/                   shadcn/ui components

hooks/                  React Query hooks and the chat state machine
services/               One typed function per backend endpoint
lib/
  api/                  axios client, error normalisation, types, query keys
  chat/store.ts         Persisted chat transcript store
  lottie/animations.ts  Lottie animations written as code
  format.ts             Local date/time formatting for events and approvals

docs/API.md             Backend API reference (the contract this app follows)
```

---

## Design system

- **Palette**: warm paper background, near-black ink, and one vermillion accent (`--brand`). Every colour is a CSS variable in `app/globals.css` with a light and a dark value, exposed to Tailwind as `bg-brand`, `text-ink`, `bg-surface`, `text-success` and so on.
- **Type**: Instrument Serif for headings (`font-serif`, italics in the accent colour), Geist for UI text, Geist Mono for small labels.
- **Motion**: content fades and lifts in on scroll (`Reveal`), headings reveal word by word, and buttons respond on hover and press. `<MotionConfig reducedMotion="user">` turns transforms off for people who prefer reduced motion.
- **Lottie**: the thinking dots, pulse rings and success check are generated as Bodymovin JSON in `lib/lottie/animations.ts`, so there are no binary assets to manage. Change the colours there.

---

## Deployment

Any Node.js host that runs Next.js works (Vercel, Render, Railway, a VPS…).

1. Set `LEKAN_API_URL` to your backend URL **in the build environment as well as at runtime**. Rewrites are resolved when the app is built.
2. Build and start:
   ```bash
   yarn install
   yarn build
   yarn start          # honours the PORT environment variable
   ```
3. On the backend, make sure Google's OAuth redirect URI points at the **backend's** `/auth/google/callback`.

> The backend has no authentication (see [Security notes](#security-notes)). Anyone who can open your frontend can use it to read the connected Google account. Don't deploy it publicly without adding auth.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `GET /api/health 500` in the console, chat says **Server offline** | The proxy can't reach the backend. Check `LEKAN_API_URL`, **restart `yarn dev`**, and check `curl $LEKAN_API_URL/health` |
| The first request after a while is slow or fails | Free-tier hosts (such as Render) put the backend to sleep. Waking up can take up to a minute. The chat retries `/health` every 10 s on its own |
| `Could not find the Next.js package (next/package.json)` | Turbopack doesn't support Yarn Plug'n'Play. Use the provided scripts (`--webpack`), or add `nodeLinker: node-modules` to `.yarnrc.yml` and run `yarn install` again |
| "Another next dev server is already running" | Next 16 allows one dev server per project. Stop the existing one (the message gives its PID) |
| Google stays "not connected" after signing in | Click **Check** in the chat banner. If it still fails, confirm the backend's Google redirect URI and that `/auth/status` reports `connected: true` |
| Old icon still shows in the browser tab | Hard-refresh. Browsers cache favicons aggressively |

---

## Security notes

- The backend API has **no authentication** and holds one Google account's login. Run it on infrastructure you control.
- Approvals protect against the **AI** doing something unexpected. They don't protect against other people who can reach the API.
- Assistant replies may quote email content. They are rendered with `react-markdown` (no raw HTML) plus `rehype-sanitize`, and every link opens in a new tab with `rel="noopener noreferrer"`.
- Chat history is stored only in the browser's `localStorage`. No analytics or third-party logging is included.
