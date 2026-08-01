# Bille
# Mobile
Version: 0.1

Platform: **React Native**, targeting **iOS and Android** from one
codebase. This document ties together everything decided in 01–09 into
concrete technical choices for building the app.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React Native | Single codebase for iOS + Android, matches team's likely JS/React familiarity |
| Local database | SQLite, via `react-native-sqlite-storage` or WatermelonDB | Matches Offline First decision (05); WatermelonDB adds a reactive layer on top of SQLite if the UI needs live-updating lists, at the cost of more setup |
| Navigation | React Navigation, bottom tab navigator | Matches the Home / Customers / Reports / Settings tab bar from 08 UI Design |
| State management | React Context + hooks for V0.1 | App is single-user, single-device, moderate data volume — a heavier state library (Redux, Zustand) isn't justified yet; revisit if state logic grows complex |
| File export/share | `react-native-share` + `react-native-fs` | Needed for statement export (PDF/Image/Text) and full backup export (FR-9, FR-11) |
| PDF generation | `react-native-html-to-pdf` or similar | For Customer Statement / Reports export to PDF |

---

## Project structure (suggested)

```
/src
  /db          — SQLite setup, migrations, schema (05)
  /logic       — the Backend logic layer (09): customer, transaction,
                  balance, trash, dashboard, reports, export modules
  /api         — thin wrappers exposing 06 API Design operations to
                  the UI, calling into /logic
  /screens     — one folder per screen from 07/08:
                  Dashboard, CustomerList, CustomerDetail,
                  AddTransaction, Trash, Reports, Backup
  /components  — shared UI pieces (stat card, transaction row,
                  balance card, buttons) styled per 08 UI Design
  /navigation  — bottom tab navigator + stack navigators per tab
```

Keeping `/logic` and `/api` separate from `/screens` means the Backend
logic layer (09) can be unit-tested independently of any UI code —
important since balance correctness (NFR-Reliability) is the app's
most critical property.

---

## Screen-to-navigation mapping

| Tab | Screens (stack) |
|---|---|
| Home | Dashboard |
| Customers | Customer list → Customer detail → Add charge/payment → Delete warning dialog |
| Reports | Reports menu → individual report views |
| Settings | Backup and restore, Trash |

Trash lives under Settings rather than its own tab — it's an
infrequent, maintenance-style action, not a daily one, so it doesn't
need equal billing with Home/Customers/Reports in the tab bar.

---

## Offline behavior

- The app never makes a network call. All screens read/write SQLite
  directly through the logic layer.
- No loading spinners tied to connectivity — reads should feel
  instant, per NFR-Performance (<1s search).
- Since there's no login and no server, there's no "logged out" or
  "no connection" state to design for in V0.1.

---

## Platform-specific considerations

| Concern | iOS | Android |
|---|---|---|
| File sharing (export) | Uses native share sheet | Uses native share sheet / intent |
| SQLite file location | App sandbox `Documents` or `Library` | App-private storage |
| Permissions | None needed for local-only storage | None needed for local-only storage; only relevant if exporting to shared storage on older Android versions |
| Backup file picker (restore) | iOS document picker | Android storage access framework |

Both platforms should be testable from the same React Native codebase
with minimal platform-specific branching — the only real divergence is
file system access for export/restore, which the chosen libraries
(`react-native-fs`, `react-native-share`) abstract in most cases.

---

## What's intentionally deferred (not V0.1)

- Login / authentication (Security NFR marks PIN lock and fingerprint
  as "Future")
- Cloud sync (Option B from the architecture decision — V2 only)
- Multi-device support (single-collector, single-device per 03/04)
- Push notifications, reminders

---

## Build checklist

- [ ] Set up React Native project (bare workflow or Expo — bare
      recommended if SQLite/file system libraries need native modules
      Expo doesn't support out of the box).
- [ ] Implement `/db` — SQLite schema and migrations from 05.
- [ ] Implement `/logic` — all modules from 09 Backend, with unit
      tests from its testing checklist.
- [ ] Implement `/api` — thin functions matching 06 API Design.
- [ ] Build screens per 07 Wireframes structure and 08 UI Design
      styling.
- [ ] Wire up bottom tab navigation.
- [ ] Implement export (statement, backup) and restore flows.
- [ ] Test on both a physical iOS device and Android device before
      release — simulators can mask real file-system and share-sheet
      behavior differences.
