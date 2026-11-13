# RacQr migration handoff

## Ready
Six views, tenant-scoped Cloud data, sign-in, private photo uploads, job CRUD, QR codecs, image scanning, multiline scanner buffering and thermal/sheet print controls.
13 unit/routing tests pass. Temporary real staff/customer/outsider accounts verified CRUD and privacy; verification records were removed.

## Source data needed
Attach per-table CSV or JSON exports of `clubs`, `club_members`, `jobs`, and `user` from the existing PostgreSQL database administration/export tool. User rows need original IDs, emails, names, phone numbers and pickup codes. Attach original avatar files with their paths, or identify the configured S3 provider/bucket. These files must be sanitized before import. No raw credential or session fields enter the application.
Existing ownership and memberships must map to verified Cloud identities. Old passwords and sessions do not migrate. Imported users verify email and set a new password on their first visit; never bulk-email users during import.

## Hosted cutover
Publish the app, then verify sign-in, home-screen installation and offline self-contained job tags. Club data writes still require connectivity.
Legacy paths `/api/clubs`, `/api/jobs`, `/api/jobs/:id`, `/api/photo`, `/api/photo/:userId` and camel-case field names are restored. Handlers independently validate Cloud authentication and apply user-scoped RLS. Original Better Auth cookies are intentionally not accepted. Nonpublic published API paths remain subject to the site's hosted access settings. If integrations use these paths, identify each caller and migrate authentication to supported delegated access; do not distribute copied browser tokens.
Provide the old RacQr site/domain so old printed QR links can keep resolving after cutover. No domain or external caller changes have been performed.

## Hardware
Browser QR-image scanning and thermal CSS dimensions passed. Check a physical camera, keyboard-wedge scanner and 62×29 mm / 89×36 mm printer. Label scale, quiet-zone readability and long setup strings must be confirmed on actual hardware.

## Remaining integration details
The source exposes optional S3 storage, but no provider configuration or bytes were supplied. New photo storage is private Cloud storage. Preserve the old provider only after identifying it and configuring credentials through the secure secret form; never paste them into chat.
