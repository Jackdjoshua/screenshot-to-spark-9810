# RacQr Cloudflare deployment

RacQr uses Wix for its public-facing website, Cloudflare Workers for the application, and Supabase for the database, authentication, and storage. The initial deployment can use the free `*.workers.dev` address; no custom domain or DNS changes are required.

## Build

Install dependencies with Bun to install the Cloudflare packages and refresh `bun.lock`:

```sh
bun install
bun run cf-typegen
bun run build:cloudflare
```

Do not use a frozen lockfile until the refreshed `bun.lock` is committed.

## Cloudflare environment variables

Set these in the Worker settings under Variables and Secrets:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The `VITE_` values are public and embedded in the browser bundle. Never place a service-role key in a `VITE_` variable. Only add `SUPABASE_SERVICE_ROLE_KEY` as a Cloudflare secret if a server-only admin operation requires it.

The Cloudflare build command is `bun run build:cloudflare`. After the build succeeds, deploy with `bun run deploy`.

## Supabase authentication

In Supabase Authentication → URL Configuration, set the Site URL to the deployed Worker URL and add the Worker URL plus `/auth` and `/reset-password` to the allowed redirect URLs.

For Google sign-in, enable the Google provider in Supabase Authentication → Providers and configure the Google OAuth client with the Supabase callback URL displayed there.

## Wix

Keep the public site on Wix and link its app/login buttons to the deployed Worker URL. No domain transfer or DNS change is needed.

## Verification

A successful build, deployment, authentication test, and Wix link test must each be verified before launch. These instructions do not claim those checks have already passed.
