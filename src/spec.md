# Specification

## Summary
**Goal:** Replace the Resume Editor “coming soon” placeholder with a functional, offline-first resume editing experience that loads, edits, and saves resume data.

**Planned changes:**
- Replace placeholder UI in `frontend/src/pages/ResumeEditor.tsx` with editable form controls for at least: resume title, personal info, and summary.
- Load resume data by ID using existing resume hooks (e.g., `useGetResume`) and preserve the current “Resume not found” state for missing IDs.
- Save edits using existing update hooks (e.g., `useUpdateResume`) so changes persist locally (survive refresh), update the dashboard without hard reload, and sync via the existing path when authenticated + online.

**User-visible outcome:** Visiting `/editor/$resumeId` shows a working resume editor where users can edit key resume fields and save changes that persist offline and sync when online/authenticated.
