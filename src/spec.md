# Specification

## Summary
**Goal:** Ensure PDF export includes the currently edited resume content and make draft/offline sync handling reliable with clear user-facing error messages.

**Planned changes:**
- Adjust print/PDF export rendering and print CSS so the print-only resume view is available to the browser during printing without hiding the entire app root, while keeping print-only content hidden during normal on-screen viewing.
- Fix Resume Editor draft initialization/reset so navigating between different resume IDs loads the correct resume and the editor doesn’t get stuck blank or in a non-processing state.
- Repair offline-first sync queue processing so failed operations remain queued for retry and only successful operations are removed; clear the queue only after a fully successful sync and update last-sync time.
- Add user-visible, plain-English error messages for failures during save, sync processing/retry, and PDF export/print so the app remains usable and the user understands what happened.

**User-visible outcome:** Downloaded PDFs match the current resume preview (including current unsaved edits if the user proceeds), switching between resumes edits the correct draft, pending changes reliably sync without being lost, and any save/sync/print failures show clear in-app error messages.
