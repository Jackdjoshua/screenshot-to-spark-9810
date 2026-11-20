# RacQr permanent racket QR implementation

## Product rule

One physical racket receives one permanent QR code. The QR identifies the racket record, not a stringing job and not its current specifications. Changing the owner, racket details, strings, tension, or notes must never require a new QR code.

The QR payload is an opaque random UUID token only:

`RACQR/RACKET/1 <qr_token>`

It must never contain a customer's name, phone number, email, racket setup, payment information, or job details. Scanning is an authenticated staff workflow; database row-level security remains the access boundary.

## Existing implementation to preserve

- `public.rackets` currently stores personal, user-owned saved rackets.
- `public.jobs` stores stringing jobs with customer and racket specification snapshots.
- Current job QR tags encode job snapshots and must continue working for existing printed tags.
- The scanner already supports camera, uploaded QR images, and keyboard scanner input.
- Do not repurpose or delete personal rackets or existing jobs.

## Recommended shop data model

Create a club-scoped customer directory so a pro shop can register customers who do not have RacQr login accounts.

### `public.club_customers`

- `id uuid primary key default gen_random_uuid()`
- `club_id uuid not null references public.clubs(id) on delete cascade`
- `profile_id uuid null references public.profiles(id) on delete set null` (optional link when the customer has a RacQr account)
- `name text not null`
- `phone text not null default ''`
- `email text not null default ''`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Index by `(club_id, name)`; add a partial unique index on `(club_id, profile_id)` when `profile_id is not null`.

### `public.club_rackets`

- `id uuid primary key default gen_random_uuid()`
- `club_id uuid not null references public.clubs(id) on delete cascade`
- `customer_id uuid not null references public.club_customers(id) on delete restrict`
- `qr_token uuid not null unique default gen_random_uuid()`
- Permanent physical details: `brand text not null default ''`, `model text not null default ''`, `racket_type text not null default 'tennis'`, `head_size numeric null`, `pattern text not null default '16x19'`, `frame_weight numeric null`, `notes text not null default ''`
- Editable current setup: `mains_string text not null default ''`, `crosses_string text not null default ''`, `unit text not null default 'lb'`, `mains_tension numeric null`, `crosses_tension numeric null`, `gauge text not null default ''`, `pre_stretch text not null default '0%'`, `knots integer not null default 4`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `archived_at timestamptz null`

Index by `(club_id, customer_id)` and `(club_id, created_at desc)`. Do not allow a QR token to be changed through normal update policies. Prefer archiving to deleting a racket so a physical label cannot accidentally be reassigned.

### Link jobs to rackets

Add nullable `racket_id uuid references public.club_rackets(id) on delete set null` to `public.jobs`. Existing jobs remain valid with `racket_id is null`.

Keep the existing job racket, pattern, string, tension, customer and payment columns as snapshots. A job must retain the exact specifications used at the time, even if the racket's current setup or owner is later changed.

When a job is created from a racket profile, copy the selected racket's current owner and setup into the job snapshot columns. When a job is completed, update the racket's current setup from the completed job. Editing the racket's current setup must never rewrite old jobs.

## Security requirements

- Enable RLS on both new tables.
- Only approved staff in the same club may create, update, archive, or scan/read shop customer and racket records. Use the existing approved-staff helper as the initial policy boundary.
- A linked customer may read their own customer record and rackets only if this customer-facing access is deliberately enabled; do not expose other customers.
- Never add an anonymous/public SELECT policy for QR tokens or racket data.
- Ensure `club_rackets.club_id` matches the referenced customer record's `club_id`; enforce this with a composite foreign key or a database trigger, not client-only validation.
- Ensure `jobs.club_id` matches the linked racket's `club_id` when `racket_id` is supplied.
- Do not weaken existing RLS or change existing personal `rackets` policies.
- Keep all schema changes additive and preserve all existing records.

## UI and QR label behaviour

1. Staff create or select a customer.
2. Staff register each physical racket under that customer.
3. The database creates its permanent `qr_token`.
4. RacQr displays the racket profile and a printable QR label.
5. Print label size: exactly 25.4 mm × 25.4 mm (1 inch square), black on white, with a proper quiet zone. The QR should use the full label efficiently; avoid large decorative branding.
6. Scanning the label resolves the token to the racket profile only for approved staff in that club.
7. From the profile, staff can start a new job, edit the current setup, change ownership, and inspect complete stringing history.
8. Ownership and setup edits never change the QR token.
9. Reprinting a damaged label uses the same token.

## Migration and rollout

- Do not edit Drizzle migration files or generated Supabase types by hand. The project instructions designate Lovable as the database schema manager.
- Apply the schema through Lovable, then regenerate/update the Supabase types through the project's supported Lovable workflow.
- Preserve old job QR decoding and printing.
- Do not automatically convert personal `rackets` into club-owned records; offer an explicit staff-assisted registration/linking workflow later.
