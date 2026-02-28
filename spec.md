# Specification

## Summary
**Goal:** Add a protected `/signups` page that requires Internet Identity authentication to view the list of Blue Panthers sign-ups.

**Planned changes:**
- Add a new `/signups` route in the frontend that shows a sign-in prompt to unauthenticated users and the full sign-up list to authenticated users.
- Include login/logout controls on the new page consistent with the existing app design.
- Add a navigation link to the new page in the app header or menu.
- Expose a backend query that returns all sign-up records to any authenticated caller, while rejecting anonymous callers.

**User-visible outcome:** Signed-in users can navigate to a dedicated page and view the full list of players who have signed up for Blue Panthers; users who are not signed in see a prompt to log in instead.
