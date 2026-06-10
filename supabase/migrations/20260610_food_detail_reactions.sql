-- Food detail sheet redesign: reaction is now optional once a food is tried.
-- New reaction values saved by the app:
--   'tried' – marked as tried, no mood logged yet
--   'meh'   – tried it, baby was unimpressed
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor) before using
-- the new sheet, otherwise saves fail with a check-constraint error.

alter table baby_food_logs
  drop constraint baby_food_logs_reaction_check;

alter table baby_food_logs
  add constraint baby_food_logs_reaction_check
  check (reaction in ('loved', 'meh', 'neutral', 'tried', 'allergic', 'not_tried'));
