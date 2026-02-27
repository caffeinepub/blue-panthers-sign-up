# Specification

## Summary
**Goal:** Add a protected Owner Dashboard page where the app owner can log in with Internet Identity and view all player sign-ups for the Blue Panthers.

**Planned changes:**
- Add a `getAllSignUps` query function in the backend that returns all stored sign-up records (ID, name, email, phone, age, position, experience level)
- Add a `useGetAllSignUps` React Query hook in `useQueries.ts` to fetch all sign-ups from the backend
- Create an `OwnerDashboard` page (`/owner` route) that shows a login prompt for unauthenticated users and a table of all sign-ups for authenticated users, styled with the existing navy and gold design system
- Add a discreet navigation link to the Owner Dashboard in the app header or footer

**User-visible outcome:** The app owner can navigate to a hidden Owner Dashboard link, log in with Internet Identity, and view a table of everyone who has signed up for the Blue Panthers.
