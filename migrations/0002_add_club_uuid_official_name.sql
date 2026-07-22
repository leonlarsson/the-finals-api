-- Migration number: 0002 	 2026-07-22T16:03:38.791Z

ALTER TABLE leaderboard_entries ADD COLUMN club_uuid TEXT;
ALTER TABLE leaderboard_entries ADD COLUMN official_club_name TEXT;
