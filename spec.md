# Specification

## Summary
**Goal:** Change the Guard position's maximum capacity from 2 to 1 slot in both the backend and frontend.

**Planned changes:**
- Update the Guard position's max capacity to 1 in the backend sign-up validation logic (Forward and Center remain at 2)
- Update the HeroSection stats bar to display "1 Slot Open" (singular) for Guard when empty, and "Full" when the single slot is taken
- Add a migration module (`backend/migration.mo`) to persist the Guard capacity change to 1 during canister upgrade while preserving existing sign-up data

**User-visible outcome:** The Guard position now shows only 1 available slot in the hero stats bar, and the backend rejects any second Guard sign-up attempt with a capacity error.
