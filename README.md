# SP Committee Management System

A PHP application deployed on **Hostforge**, with a modern civic interface built
from React, shadcn/ui, and Tailwind CSS v4. PHP still owns URLs, sessions, OTP
verification, RBAC, and backend APIs. Node.js is required only when building assets.

## Develop and verify

Use Node.js 24 and the committed npm lockfile:

```sh
npm ci
npm run watch
```

Serve the project using PHP/Apache, then refresh the page after a rebuild. For a
standalone local PHP server:

```sh
php -S 127.0.0.1:8765 -t .
```

The backend requires its usual database and service configuration for real data,
OTP email, and Gemini calls. The frontend does not receive server secrets.

```sh
npm run test
npm run format:check
npm run build
```

Tests use mocked API responses and do not send real OTP emails, invoke Gemini, or
modify the application database. They exercise all screens, API compatibility,
permission controls, form retries, duplicate submission prevention, scoring,
recommendation acceptance, report generation, and export behavior. Browser visual
checks remain separate from these tests.

## Component architecture

- `pages/*.php` are thin PHP entrypoints. Protected pages run the existing session
  and permission guard before rendering anything.
- `includes/app_view.php` renders one application mount, an independent portal
  mount, and safely encoded `window.APP_CONFIG`. Bootstrap includes the page,
  metadata, server-generated URLs, user identity, role, and permissions.
- `frontend/main.tsx` loads React and the app. `frontend/app.tsx` lazy-loads the
  selected screen; navigation remains ordinary PHP page navigation.
- `frontend/components/shell.tsx` owns shared navigation and the application shell.
  `shared.tsx`, `management.tsx`, and `charts.tsx` provide reusable page building blocks.
- `frontend/components/ui/` contains the local shadcn primitives. Dialog, select,
  menu, sheet, and tooltip portals render inside `ui-portal-root`.
- `frontend/lib/` holds typed API adapters, permissions, query/mutation hooks,
  calculations, and report export helpers. TanStack Query owns request state;
  TanStack Table provides search, sorting, and 10/25/50-row pagination.

The nine authenticated screens use the shared React interface. The landing/authentication
page preserves its original PHP markup, styling, branding, and OTP interaction.
Its legacy assets load only on the login page; the authenticated screens use the
compiled React assets. Frontend permissions control presentation; PHP remains the
authorization authority.

Theme tokens and responsive layouts live in `frontend/styles.css`. The design uses
navy `#0B3A6E`, gold `#D6A23A`, pale `#F4F6FA`, white surfaces, the system font stack,
and Lucide icons. Utilities retain the `tw:` prefix and normal CSS precedence.
Scoped resets cover the application and portals; global Tailwind Preflight is omitted.
Reduced-motion preferences and keyboard access are supported.

Add a shadcn component with:

```sh
npm run ui:add -- component-name
```

After generation, point class-merging imports to `@/lib/utils` and route any new
primitive portals into `document.getElementById("ui-portal-root")`. The CLI may
install the standalone `cn` package; local components use the existing helper,
which understands the `tw:` prefix. Review theme tokens and accessibility for new
components, then format, test, and rebuild.

## Committee workflow

The workspace is branded **SP — Sangguniang Panlungsod**. Existing role codes and
login accounts remain compatible. Record authorized committee details from the
council's internal rules, resolution, ordinance, or other establishing instrument;
creating an application record does not enact legislation.

- Members holds the council/committee roster and monthly attendance summaries.
- Committees records Standing, Ad Hoc, or Advisory type, issuance date, issuer,
  authority reference, and optional term end date. Names can be entered before
  jurisdiction exists. Old saved classifications remain editable.
- Jurisdiction records Decision-making, Recommendatory, or Monitoring, legal basis,
  area, optional start, and the committee's shared **effective-until** date.
  Decision-making means powers within the recorded mandate. The penalty matrix
  catalogs existing legal provisions; it does not authorize enforcement or create fines.
- Assignments manages committee membership and operational tasks. Each committee
  has at most one Chairperson and one Secretary. Preserve the existing five-member
  and five-open-task caps as application policies, not statutory requirements.
- Tasks follow Open → In progress → Awaiting approval → Completed. A different,
  authorized reviewer approves completion. Submission time determines timeliness;
  reviewer identity and approval time are stored separately. Unfinished work counts
  toward capacity. Membership cannot be removed while its work is unfinished.
- Workload and Performance monitor these same tasks. Performance uses 50% task
  completion + 20% latest attendance + 30% on-time completion. Missing evidence
  earns no points; historic dates and approvals are not invented.
- Reports apply selected committee and dates, and store immutable server-generated
  snapshots. Dates select tasks by creation date, attendance by reporting month,
  and committee reports by issuance date. Roster totals reflect generation time.
  Archives copy the saved snapshot and repeated archive requests reuse its reference.
  Historical metadata-only reports need regeneration before archival.
- Session export stores a local snapshot calculated from source tasks and attendance.
  It does not submit to an external session system. AI results remain advisory and
  respect the requesting account's scope; they do not silently create global reports.
- Scoped accounts require linked members. Roles and permissions continue to govern
  actions. Diagnostic endpoints are disabled unless COMMITTEE_DIAGNOSTICS=1 and
  the user is an authenticated super administrator.

Existing databases need the additive SQL files in `database/migrations/`, in numeric
order. They preserve historic data and may safely be run again. Apply them before
deploying these APIs. Fresh installations use `production_schema.sql`.

Run `npm test`, `npm run build`, `npm run format:check`, and
`php backend/tests/workflow_test.php` to verify the interface and workflow rules.
See [the review notes](docs/workflow-review.md) for coverage and procedural boundaries.

## Development database seeds

`database/seed_all.php` is the source for the complete development/demo dataset.
`database/seed_all.sql` contains the matching SQL import used by Docker initialization.
Both include six committees with jurisdiction coverage and memberships, seven
members, eight login accounts covering all six roles, tasks, attendance, and reports.
Repeated seeding does not create duplicate records. Existing OTP codes and exported
records are cleared only by an explicit reset.

Seed an existing local application schema with:

```sh
php database/seed_all.php
```

To reset the configured local database and seed fresh data:

```sh
php database/seed_all.php --reset --backup=/absolute/path/before-reset.sql
```

Reset is CLI-only and restricted to a localhost database. It creates a data backup
before changing records, then clears and reseeds application data in one transaction.
It preserves schema and triggers. Restore the backup into the same application
schema if needed. Keep backups outside the web directory.

After changing the PHP seed data, populate a fresh isolated database named
`committee_seed_test_*` with `production_schema.sql`, then run:

```sh
php database/seed_all.php --database=committee_seed_test_example
php database/build_seed_sql.php committee_seed_test_example
```

The generator resolves foreign keys by natural identifiers instead of carrying
database-specific UUIDs into the SQL file. The SQL file includes demo data and
must not be imported into an existing live Hostforge database.

## Hostforge deployment

For PHP-only hosting, run `npm ci`, `npm run test`, and `npm run build` locally or in
CI. Upload the PHP application, branding assets, and the **entire** `assets/build/`
directory. Also include `assets/css/style.css` and `assets/js/app.js` for the
preserved authentication page. The build directory contains `ui.css`, `ui.js`, and all hashed shared/screen chunks.
Uploading just the two entry files will break screen loading.

Hostforge needs only PHP and static asset serving at runtime. No npm process,
React server, Vite server, or CDN Tailwind script is required. Apply the additive database migrations before updating the APIs.
Do not upload `node_modules/`, `frontend/`, test files, or development tooling.
Preserve the live database and server-side configuration.

Deploy PHP and assets as one release. Keep the previous release available for
rollback. Retain old hashed chunks during an upload-based transition so clients
that loaded the previous entry script can finish loading their screens.

For Docker, the Dockerfile compiles frontend assets in a Node stage and copies
them into the PHP/Apache image. `.dockerignore` excludes local secrets and
`node_modules`; provide secrets through the runtime environment. Docker Compose
bind-mounts the source tree for local development, so run the build on the host
before starting it. Production should serve the built image without that bind mount.

Asset and API URLs support a domain root or subfolder. If document-root detection
does not match the hosting layout, set `COMMITTEE_APP_BASE` in
`backend/config/local.php` (`''` for the domain root). Rebuild after source changes;
entry assets use file timestamps and internal chunks have content hashes.

No changes have been published to Hostforge by this redesign.
