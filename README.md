# PhotoProcessor Webapp

React frontend for the PhotoProcessor API — browse photos, watch ML jobs process them, and manage the people the face-recognition pipeline discovers.

## Running

```
npm install
npm run dev
```

Requires the PhotoProcessor API running on `http://localhost:5030` (configurable via `VITE_API_BASE_URL` in `.env.development`).

## Structure

- `src/api/httpClient.js` — fetch wrapper: JSON handling, query strings, errors, and `url()` for `<img src>` endpoints.
- `src/api/baseCrudApi.js` — mirrors the API's `BaseController` (`Get`/`GetFor`/`List`/`Upsert`/`UpsertMany`/`Delete`); `createCrudApi("Tag")` yields a full client for any entity controller.
- `src/api/entityApis.js` — the generated CRUD clients, one per entity controller.
- `src/api/photoApi.js`, `identityApi.js`, `fingerprintApi.js` — bespoke (non-CRUD) endpoints.
- `src/hooks/` — TanStack Query hooks: paged lists, uploads, identity rename/merge with cache invalidation.
- `src/pages/` — Gallery, Photo detail, People, Person detail.
