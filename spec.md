# Specification

## Summary
**Goal:** Enable team sign-ups on the Sign-Up page with exactly 3 available slots, replacing the current locked/closed state with a functional form.

**Planned changes:**
- Replace the "No Positions Left" / "Registration Closed" message on the Sign-Up page with a sign-up form (fields: name, position, experience level).
- Display the number of remaining slots (e.g., "2 slots remaining") on the form.
- On successful submission, show a confirmation message.
- Enforce a hard cap of 3 total sign-up slots in the backend; reject any 4th submission with an error.
- When all 3 slots are filled, replace the form with a "Team Full" notice on the frontend.

**User-visible outcome:** Visitors can submit their information to join the Blue Panthers team. The form tracks and displays remaining slots in real time, and automatically locks with a "Team Full" message once all 3 slots are taken.
