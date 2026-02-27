# Specification

## Summary
**Goal:** Mark the "Guard" position as unavailable on the Blue Panthers sign-up page and hero section so users cannot sign up for that position.

**Planned changes:**
- In `SignUpPage.tsx`, disable the Guard option in the position selector, add a visible "Not Available" label/badge next to it, and block form submission if Guard is somehow selected.
- In `HeroSection.tsx`, update the stats/positions bar to show Guard as "Unavailable" or "Closed" while keeping other positions shown as available.

**User-visible outcome:** Visitors to the sign-up page will see Guard clearly marked as unavailable and will be unable to select or submit the form with that position. The hero section will consistently reflect that Guard is not open.
