-- Allow all currencies offered in the Club Customisation dropdown.
-- Keep the three existing currency codes valid for any older records.
ALTER TABLE public.clubs
  DROP CONSTRAINT IF EXISTS clubs_currency_check;

ALTER TABLE public.clubs
  ADD CONSTRAINT clubs_currency_check
  CHECK (currency IN (
    '$', '£', '€', 'C$', 'A$', 'CHF', '¥',
    'USD', 'GBP', 'EUR'
  ));
