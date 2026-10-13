# v0.47 Cloud backup rollout

**Do not merge/deploy until Supabase SQL Editor has run `supabase/migrations/20261013_user_backups.sql` and RLS has been verified.**

1. Run the SQL migration in project `cscwtcykklxyremzjdio`. Confirm RLS is enabled on `public.user_backups` and all four user-scoped policies exist.
2. Test with two separate Google test accounts: each can save and restore its own data; account B cannot read, overwrite, or delete account A's backup via the Supabase REST API. Test unauthenticated access denied.
3. Download the existing full JSON backup (includes local photos). Verify Google login/logout, manual save/restore, cancellation, and offline behavior before rollout.
4. Merge PR to main only after SQL and access tests. Never place service_role or Google Client Secret in the web app.

Limitations: manual snapshots only, no auto-sync; last writer can win during concurrent writes, even with the preflight timestamp check. Photos stay local; cloud restore does not transfer photos. The server holds unencrypted JSONB visit records, notes, GPS coordinates and license profile data. RLS is authorization, not end-to-end encryption. Treat this as sensitive user data; establish retention/deletion and privacy notices before inviting users.
