# Specification

## Summary
**Goal:** Change the maximum number of open slots for each basketball position (Forward, Center, Guard) from 5 to 2.

**Planned changes:**
- Update backend capacity enforcement so each position (Forward, Center, Guard) has a maximum of 2 slots, rejecting sign-ups once 2 players are registered for that position.
- Update the HeroSection stats bar to display "2 slots" for each position (Forward, Center, Guard).

**User-visible outcome:** The sign-up page shows 2 available slots per position, and the backend rejects registrations once 2 players have signed up for any given position.
