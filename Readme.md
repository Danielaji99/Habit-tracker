# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built with Next.js, React, TypeScript, and Tailwind CSS. All data is persisted locally using localStorage.

---

## Project Overview

This app lets users:
- Sign up and log in with email and password (local auth, no backend)
- Create, edit, and delete daily habits
- Mark habits complete for today and track their current streak
- Install the app as a PWA and use it offline

---

## Setup Instructions

**Requirements:** Node.js 18+

```bash
# Clone and install dependencies
npm install

# Install Playwright browser (uses system Chrome)
# Chrome must be available at /opt/google/chrome/chrome
```

---

## Run Instructions

```bash
# Development server
npm run dev

# Production build + start
npm run build
npm run start
```

The app will be available at http://localhost:3000.

---

## Test Instructions

```bash
# Unit tests with coverage (src/lib files)
npm run test:unit

# Integration / component tests
npm run test:integration

# End-to-end tests (requires build first)
npm run build
npm run test:e2e

# Run all tests
npm test
```

> **Note on e2e tests:** Playwright uses the system Chrome at `/opt/google/chrome/chrome`. The `test:e2e` script starts a production server on port 3001 automatically via the `webServer` config. If running in a resource-constrained environment, run individual tests with `--grep "test name"`.

---

## Local Persistence Structure

All data is stored in `localStorage` under three keys:

| Key | Shape | Description |
|---|---|---|
| `habit-tracker-users` | `User[]` | All registered users |
| `habit-tracker-session` | `Session \| null` | Currently logged-in user |
| `habit-tracker-habits` | `Habit[]` | All habits for all users |

**User shape:**
```ts
{ id: string; email: string; password: string; createdAt: string }
```

**Session shape:**
```ts
{ userId: string; email: string }
```

**Habit shape:**
```ts
{
  id: string; userId: string; name: string; description: string;
  frequency: 'daily'; createdAt: string; completions: string[]
}
```

`completions` holds unique ISO calendar dates (`YYYY-MM-DD`) for days the habit was completed.

---

## PWA Support

The app implements basic PWA support via:

1. **`public/manifest.json`** — Declares app name, icons, theme color, and `display: standalone` so it can be installed from the browser.
2. **`public/sw.js`** — A service worker that:
   - Caches the app shell routes on install
   - Serves cached responses when offline (network-first with cache fallback)
   - Updates the cache on each successful network response
3. **`src/components/shared/ServiceWorkerRegistration.tsx`** — A client-only React component that registers the service worker via `navigator.serviceWorker.register('/sw.js')` inside a `useEffect`.
4. **`public/icons/icon-192.png` and `icon-512.png`** — Required PWA icons.

After one online load, the app shell renders offline without crashing.

---

## Trade-offs and Limitations

- **No real authentication:** Passwords are stored in plaintext in localStorage. This is intentional per the spec (local-only, no backend).
- **No encryption:** All data in localStorage is readable by any JS on the page.
- **Single-device only:** Data does not sync across devices or browsers.
- **Daily frequency only:** The spec requires only `'daily'` frequency; weekly/custom are not implemented.
- **PWA offline scope:** The service worker caches the app shell, but habit data itself (in localStorage) is always available regardless—it never goes to a server.
- **E2e environment:** Tests use system Chrome (`/opt/google/chrome/chrome`) rather than a Playwright-managed browser due to network restrictions in the build environment.

---

## Test File Map

### Unit Tests — `tests/unit/`

| File | Behavior Verified |
|---|---|
| `slug.test.ts` | `getHabitSlug`: lowercase, hyphenation, space trimming, special char removal |
| `validators.test.ts` | `validateHabitName`: empty rejection, 60-char limit, trimmed valid value |
| `streaks.test.ts` | `calculateCurrentStreak`: empty/no-today = 0, consecutive days, duplicates, gaps |
| `habits.test.ts` | `toggleHabitCompletion`: add/remove dates, no mutation, no duplicates |
| `storage.test.ts` | localStorage read/write round-trips for users, session, and habits |

### Integration Tests — `tests/integration/`

| File | Behavior Verified |
|---|---|
| `auth-flow.test.tsx` | Signup creates session; duplicate email error; login stores session; invalid credentials error |
| `habit-form.test.tsx` | Empty name validation; create renders habit; edit preserves immutable fields; delete requires confirmation; toggle updates streak |

### End-to-End Tests — `tests/e2e/app.spec.ts`

| Test Title | Behavior Verified |
|---|---|
| shows the splash screen and redirects unauthenticated users to /login | `/` shows splash then redirects unauthenticated |
| redirects authenticated users from / to /dashboard | `/` redirects to dashboard when session exists |
| prevents unauthenticated access to /dashboard | `/dashboard` redirects to `/login` without session |
| signs up a new user and lands on the dashboard | Full signup flow, empty state visible |
| logs in an existing user and loads only that user's habits | Login isolates habits by userId |
| creates a habit from the dashboard | Full create habit flow, card appears |
| completes a habit for today and updates the streak | Toggle completion, streak increments to 1 |
| persists session and habits after page reload | Data survives hard reload |
| logs out and redirects to /login | Logout clears session, redirects |
| loads the cached app shell when offline after the app has been loaded once | Offline mode: no crash, content renders |
