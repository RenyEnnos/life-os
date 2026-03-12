# MVP Desktop Release Notes

## Release scope

This MVP ships only as a desktop local-first application in the verified Electron runtime.

## Included in this MVP

- Electron desktop runtime with local SQLite storage and IPC-backed app flows.
- Verified desktop flows for launch, restored session, protected navigation, task creation, habit creation, and local persistence.
- Linux release artifact at `release/0.1.0/Life OS-0.1.0.AppImage`.

## Not included

- Sync or cloud-backed guarantees.
- Browser or web usage.
- Any claim that Supabase auth is production-proven for this MVP release.
- Broader product behavior outside the verified desktop local-first path.

## How to run

For Linux users:

1. Open a terminal in the repository root.
2. Make the AppImage executable:

```bash
chmod +x "release/0.1.0/Life OS-0.1.0.AppImage"
```

3. Open the MVP build:

```bash
./"release/0.1.0/Life OS-0.1.0.AppImage"
```

If your file manager supports AppImage launch, you can also open the same file directly after marking it as executable.
