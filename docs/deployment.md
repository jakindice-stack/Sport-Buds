# Deployment

## Overview
This repo contains two apps:

- `client/`: Vite + React frontend
- `api/`: Node/Express API (talks to Supabase)

The frontend authenticates with Supabase and calls the API using `VITE_API_BASE`.

## Environment Variables

### Client (`client/.env`)
Required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE`

Example:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_API_BASE=http://localhost:5000/api
```

Notes:

- `VITE_SUPABASE_ANON_KEY` is required to run the app, but do not paste keys into this doc.
- Only store secrets in your environment manager (Amplify env vars, `.env` locally, or AWS Secrets Manager).

### API (`api/.env`)
Required:

- `PORT` (defaults to `5000` if not set)
- Supabase service configuration used by the API (var names depend on `api/src` implementation)

## Local Development

### 1) Install
From repo root:

```bash
npm install
```

### 2) Run API
From repo root:

```bash
npm run dev
```

Or run directly from `api/`:

```bash
npm run dev
```

API should be available at:

- `http://localhost:5000/api`

### 3) Run Client
From `client/`:

```bash
npm run dev
```

Client should be available at:

- `http://localhost:3000`

## Supabase Setup

### Schema cache reload (PostgREST)
If Supabase errors with:

- `Could not find the '<column>' column ... in the schema cache`

Run this in Supabase **SQL Editor**:

```sql
select pg_notify('pgrst', 'reload schema');
```

Wait ~20–30 seconds, then retry.

### Events table policies (RLS)
If you see:

- `new row violates row-level security policy for table "events"`

Ensure you have RLS policies that allow authenticated users to insert/update/delete their own events (commonly `host_id = auth.uid()`).

## Production Deployment (Amplify)

## Production URLs

- Supabase base URL: `https://rnqnznhqcsnfqobwneat.supabase.co`
- Amplify URL (frontend): `https://main.dsokgqwwi5ahz.amplifyapp.com`
- API Gateway ID: `y6h9whyej9`
- Lambda function name: `sport-buds-api-dev-api`
- API Gateway URL (what `VITE_API_BASE` should point to): `https://y6h9whyej9.execute-api.us-east-2.amazonaws.com/api`

### 1) Configure build
This repo includes `amplify.yml` at the root. Ensure Amplify is building the `client/` app and publishing the correct build output.

### 2) Set environment variables in Amplify
In Amplify Console:

- App settings -> Environment variables

Add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE` (URL to your deployed API)

### 3) SPA routing
For React Router, your host must rewrite unknown routes to `index.html`.

## Smoke Test Checklist

- Auth: sign in / sign out
- Create Event: submit form, verify it redirects to `/app/find-events`
- Find Events: new event appears
- Profile: loads `/profiles/me` and saves changes

## Troubleshooting

### Magic link emails not arriving
Check:

- Supabase Dashboard -> Authentication -> Logs (confirm an email send attempt exists)
- Spam/Promotions folders
- Configure SMTP provider for reliable delivery
