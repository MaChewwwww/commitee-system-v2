# SK Committee Management System

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

## Preserved workflow rules

- Members may have at most five pending tasks. Existing workload thresholds remain:
  fewer than two is underloaded, two through five is balanced, and above five is overloaded.
- The performance screen keeps 50% completion, 20% attendance, and 30% on-time
  scoring, with existing grade boundaries. Successful AI analysis can supply the
  existing server-calculated scores. Saving attendance returns to local calculations.
- Performance reports retain the existing completion-based grading, distinct from
  the weighted performance screen. All five report types remain available.
- Reporting dates label saved report metadata; report figures use current
  accessible records, as before. Committee reports use the selected committee.
- AI recommendations use the existing server policy: available members, below the
  five-task cap, not already assigned. Lower workload limits are additionally
  applied to returned recommendations when task data is accessible. Existing
  successful AI results remain visible if a later request fails.
- Role changes require `roles.manage`. Users cannot delete or deactivate themselves.
- Committee-name options come from existing committees linked to Jurisdiction.
  The edit dialog shows linked coverage and allows permission-controlled member
  additions, role updates, and confirmed removals. Membership changes save
  immediately through the assignment API, separately from committee details, with
  the existing maximum of five members per committee.
- Archive export and session-management actions retain their PHP endpoints and
  permissions. URLs follow the configured application base instead of a hardcoded path.

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
React server, Vite server, CDN Tailwind script, or database migration is required.
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
