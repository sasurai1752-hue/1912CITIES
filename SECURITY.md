# 1912CITIES security checklist (v0.46)

- Google OAuth via Supabase: public publishable key only in client; keep Google Client Secret and service_role/secret keys server-side.
- Visit records and photos remain local. No cloud database sync is implemented.
- GPS verification transmits photo coordinates to OpenStreetMap Nominatim after confirmation. This can disclose precise location to the external service.
- JSON backups may contain visit dates, notes, GPS coordinates, photos and profile data; protect and avoid publicly sharing them.
- Before cloud sync: create user-scoped tables with RLS enabled, verify policies for SELECT/INSERT/UPDATE/DELETE and test access denial with a second account. Never rely on UI filtering as access control.
- Before public launch: test OAuth redirects, account logout, backup/restore, GPS verification, and offline behavior; review privacy notice and retention/deletion practices.
- The current HTML uses inline scripts and inline event handlers; do not enable a restrictive CSP without refactoring and browser testing. Plan CSP and SRI for a later release.
- Supabase JS is pinned to 2.94.1 for repeatability; review for updates/security advisories periodically.
