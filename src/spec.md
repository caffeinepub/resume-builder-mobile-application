# Specification

## Summary
**Goal:** Add an Android-only in-app PWA install popup that proactively prompts eligible users to install, with dismissal and cooldown controls.

**Planned changes:**
- Show an in-app install popup on Android Chrome/Chromium only when the PWA is installable (`canInstall` true) and the app is not already installed (`isInstalled` false).
- Add actions to the popup: “Install” (triggers the existing `promptInstall()` flow) and “Not now” (dismisses and stores a cooldown in `localStorage` to prevent immediate reappearing).
- Ensure the popup never appears when already installed (standalone display mode or equivalent) and does not render on iOS or desktop; keep the existing header install control and existing install instructions dialog unchanged and functional.

**User-visible outcome:** Android users who can install the PWA will see a one-tap install popup without using the header control, can dismiss it temporarily, and won’t see it again once the app is installed.
