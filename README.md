# Sport Buds

Mobile-first web app connecting student athletes and local sports enthusiasts with nearby games, practices, and tournaments.

- Client: React PWA (Vite)
- API: Express (Node)
- Database: Supabase (SQL migrations + seeds)

This repository contains the high-level structure only. See /docs for planning artifacts.

## Deployed Application

[Live site](https://main.dsokgqwwi5ahz.amplifyapp.com)

## Local Setup

### Prerequisites

- Node.js (recommended: latest LTS)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Client env file: `client/.env`

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE` (local default: `http://localhost:5000/api`)

API env file: `api/.env`

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 3) Run the API

```bash
npm run dev:api
```

API should be available at `http://localhost:5000/api`.

### 4) Run the client

```bash
npm run dev:client
```

Client should be available at `http://localhost:3000`.

## Troubleshooting

### Supabase schema cache errors

If you see errors like:

- `Could not find the '<column>' column ... in the schema cache`

Reload the PostgREST schema cache:

```sql
select pg_notify('pgrst', 'reload schema');
```

### RLS policy errors

If you see:

- `new row violates row-level security policy for table "events"`

Confirm RLS policies exist for authenticated users (see `docs/deployment.md`).

### Magic link email not arriving

Check:

- Supabase Dashboard -> Authentication -> Logs
- Spam/Promotions folder
- SMTP configuration (recommended for reliable delivery)

## Known Issues / Incomplete Features

- Some areas may still be under active development.
- If authentication magic links are not being delivered, configure SMTP in Supabase for improved reliability.

## Support Contact

- Email: jakindice@csuchico.edu
- Phone: 9163671661
- Slack: mention me in the Slack channel
