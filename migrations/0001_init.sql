CREATE TABLE leaderboard_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  leaderboard_id TEXT NOT NULL,
  platform TEXT,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  discriminator TEXT,
  steam_name TEXT,
  xbox_name TEXT,
  psn_name TEXT,
  club_tag TEXT,
  rank INTEGER,
  value INTEGER,
  raw_entry TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (leaderboard_id, platform, name)
);

CREATE INDEX idx_entries_name ON leaderboard_entries(name COLLATE NOCASE);
CREATE INDEX idx_entries_display_name ON leaderboard_entries(display_name COLLATE NOCASE);
CREATE INDEX idx_entries_club_tag ON leaderboard_entries(club_tag COLLATE NOCASE);
CREATE INDEX idx_entries_leaderboard_id ON leaderboard_entries(leaderboard_id);

CREATE TABLE club_rankings (
  leaderboard_id TEXT NOT NULL,
  club_tag TEXT NOT NULL,
  total_value INTEGER NOT NULL,
  member_count INTEGER NOT NULL,
  club_rank INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (leaderboard_id, club_tag)
);

CREATE INDEX idx_club_rankings_club_tag ON club_rankings(club_tag COLLATE NOCASE);
