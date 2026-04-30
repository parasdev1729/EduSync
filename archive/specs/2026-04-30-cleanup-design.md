# Cleanup Design - 2026-04-30

## Goal
Remove unnecessary clutter from the project to improve maintainability and focus, while preserving potentially useful utility scripts in an archive.

## Scope
- **Root:** `docs/`, `seed_admin.js`
- **Server:** `server/seed/`, `server/tests/`, `server/list_users.js`, `server/set_passwords.js`

## Proposed Actions
1. **Archive Preservation:**
   - Create `archive/` at the project root.
   - Move `seed_admin.js` to `archive/`.
   - Move `server/list_users.js` to `archive/`.
   - Move `server/set_passwords.js` to `archive/`.
   - Move `server/seed/` contents to `archive/server-seed/`.
2. **Permanent Removal:**
   - Delete the `docs/` directory (including AI specs and plans).
   - Delete the `server/tests/` directory (reproduction scripts).
3. **Documentation:**
   - Save this design spec in `archive/specs/`.

## Success Criteria
- The project root and `server/` directory are free of non-core utility scripts and documentation.
- All seeding/utility scripts are safely stored in `archive/`.
- The application still runs and functions as expected (core logic untouched).
