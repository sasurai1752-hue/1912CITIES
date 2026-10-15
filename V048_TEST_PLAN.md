# v0.48 rollout notes
- Manual cloud backup remains unchanged; photos stay local and are not uploaded.
- Cloud status check fetches backup metadata and validates payload; shows last cloud save time, count and count-only difference.
- Restore now downloads a format-3 JSON with photos before any local changes, then asks the user to confirm that the file was actually saved. Browsers cannot guarantee successful download, so the user's verification is essential.
- LocalStorage write rollback remains in place. IndexedDB photos are not deleted.
- Test with existing 153-visit cloud backup, photo attached, offline mode, cancelled confirmation, and two Google accounts before production release.
- Important: count match does NOT prove contents match; manual cloud save can still overwrite a newer snapshot in rare simultaneous multi-device writes. Auto-sync is not implemented.
