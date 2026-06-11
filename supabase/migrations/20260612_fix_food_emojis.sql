-- Fix emoji mismatches for preloaded foods.
-- Run in Supabase Dashboard → SQL Editor.
-- No IS NULL guard — intentionally overwrites wrong values already in the database.

-- Vegetables that incorrectly received the salad emoji
UPDATE foods SET emoji = '🥒' WHERE name ILIKE 'Zucchini'    AND is_preloaded;
UPDATE foods SET emoji = '🥒' WHERE name ILIKE 'Courgette'   AND is_preloaded;
UPDATE foods SET emoji = '🌿' WHERE name ILIKE 'Asparagus'   AND is_preloaded;
UPDATE foods SET emoji = '🌿' WHERE name ILIKE 'Celery'      AND is_preloaded;
UPDATE foods SET emoji = '🥦' WHERE name ILIKE 'Cauliflower' AND is_preloaded;
UPDATE foods SET emoji = NULL  WHERE name ILIKE 'Beet%'      AND is_preloaded;

-- Butter incorrectly had ice cream emoji; 🧈 exists as of Unicode 13.0
UPDATE foods SET emoji = '🧈'  WHERE name ILIKE 'Butter'     AND is_preloaded;

-- Peanut Butter was matched by the 'Pea%' pattern before 'Peanut%' could run
UPDATE foods SET emoji = '🥜'  WHERE name ILIKE 'Peanut%'    AND is_preloaded;
