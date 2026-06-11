-- Backfill per-food emojis for preloaded foods.
-- Run in Supabase Dashboard → SQL Editor.
-- Safe to re-run: the `emoji IS NULL` guard won't overwrite already-set values.

-- Add emoji column if it doesn't exist
ALTER TABLE foods ADD COLUMN IF NOT EXISTS emoji text;

-- Fruits
UPDATE foods SET emoji = '🍎' WHERE name ILIKE 'Apple'          AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍌' WHERE name ILIKE 'Banana'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥑' WHERE name ILIKE 'Avocado'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍓' WHERE name ILIKE 'Strawberry'     AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫐' WHERE name ILIKE 'Blueberr%'      AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥭' WHERE name ILIKE 'Mango'          AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍑' WHERE name ILIKE 'Peach'          AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍐' WHERE name ILIKE 'Pear'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍉' WHERE name ILIKE 'Watermelon'     AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍊' WHERE name ILIKE 'Orange%'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍇' WHERE name ILIKE 'Grape%'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍒' WHERE name ILIKE 'Cherr%'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍍' WHERE name ILIKE 'Pineapple'      AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥝' WHERE name ILIKE 'Kiwi'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍋' WHERE name ILIKE 'Lemon'          AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫒' WHERE name ILIKE 'Olive%'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍈' WHERE name ILIKE 'Melon'          AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍈' WHERE name ILIKE 'Cantaloupe'     AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍈' WHERE name ILIKE 'Honeydew'       AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫙' WHERE name ILIKE 'Prune%'         AND is_preloaded AND emoji IS NULL;

-- Vegetables
UPDATE foods SET emoji = '🥦' WHERE name ILIKE 'Broccoli'       AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥕' WHERE name ILIKE 'Carrot%'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍠' WHERE name ILIKE 'Sweet Potato%'  AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫛' WHERE name ILIKE 'Peas'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥬' WHERE name ILIKE 'Spinach'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🌽' WHERE name ILIKE 'Corn'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥔' WHERE name ILIKE 'Potato'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍆' WHERE name ILIKE 'Eggplant'       AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍆' WHERE name ILIKE 'Aubergine'      AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍅' WHERE name ILIKE 'Tomato%'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥒' WHERE name ILIKE 'Cucumber'       AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🧅' WHERE name ILIKE 'Onion'          AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥬' WHERE name ILIKE 'Kale'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥬' WHERE name ILIKE 'Lettuce'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥬' WHERE name ILIKE 'Bok Choy'       AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🧄' WHERE name ILIKE 'Garlic'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍄' WHERE name ILIKE 'Mushroom%'      AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫑' WHERE name ILIKE 'Bell Pepper%'   AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫑' WHERE name ILIKE 'Pepper%'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥒' WHERE name ILIKE 'Zucchini'       AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥒' WHERE name ILIKE 'Courgette'      AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥜' WHERE name ILIKE 'Edamame'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🌿' WHERE name ILIKE 'Asparagus'      AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🌿' WHERE name ILIKE 'Celery'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥦' WHERE name ILIKE 'Cauliflower'    AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🌿' WHERE name ILIKE 'Parsnip'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🌿' WHERE name ILIKE 'Turnip'         AND is_preloaded AND emoji IS NULL;

-- Protein
UPDATE foods SET emoji = '🍗' WHERE name ILIKE 'Chicken'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥚' WHERE name ILIKE 'Egg%'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🐟' WHERE name ILIKE 'Salmon'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🐟' WHERE name ILIKE 'Fish'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🐟' WHERE name ILIKE 'Cod'            AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🐟' WHERE name ILIKE 'Tuna'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🐟' WHERE name ILIKE 'Tilapia'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥩' WHERE name ILIKE 'Beef'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥩' WHERE name ILIKE 'Lamb'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥩' WHERE name ILIKE 'Pork'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫘' WHERE name ILIKE 'Bean%'          AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫘' WHERE name ILIKE 'Black Bean%'    AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫘' WHERE name ILIKE 'Kidney Bean%'   AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫘' WHERE name ILIKE 'Chickpea%'      AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫘' WHERE name ILIKE 'Lentil%'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🌱' WHERE name ILIKE 'Tofu'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🌱' WHERE name ILIKE 'Tempeh'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥜' WHERE name ILIKE 'Peanut%'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥜' WHERE name ILIKE 'Almond%'        AND is_preloaded AND emoji IS NULL;

-- Dairy
UPDATE foods SET emoji = '🥛' WHERE name ILIKE 'Milk'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥛' WHERE name ILIKE 'Yogurt'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥛' WHERE name ILIKE 'Yoghurt'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🧀' WHERE name ILIKE 'Cheese'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🧀' WHERE name ILIKE 'Cottage Cheese' AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🧈' WHERE name ILIKE 'Butter'         AND is_preloaded AND emoji IS NULL;

-- Grains
UPDATE foods SET emoji = '🍚' WHERE name ILIKE 'Rice'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥣' WHERE name ILIKE 'Oat%'           AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍞' WHERE name ILIKE 'Bread'          AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍝' WHERE name ILIKE 'Pasta'          AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥞' WHERE name ILIKE 'Pancake%'       AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🌮' WHERE name ILIKE 'Tortilla%'      AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥐' WHERE name ILIKE 'Cracker%'       AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍜' WHERE name ILIKE 'Noodle%'        AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫓' WHERE name ILIKE 'Pita%'          AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🫓' WHERE name ILIKE 'Flatbread'      AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍚' WHERE name ILIKE 'Quinoa'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍚' WHERE name ILIKE 'Barley'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🥣' WHERE name ILIKE 'Cereal'         AND is_preloaded AND emoji IS NULL;
UPDATE foods SET emoji = '🍞' WHERE name ILIKE 'Waffle%'        AND is_preloaded AND emoji IS NULL;
