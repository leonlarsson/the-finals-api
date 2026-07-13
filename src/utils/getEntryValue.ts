import type { BaseUser, ClubBaseUser } from "../types";

// The main score entity for a leaderboard entry, whichever field the leaderboard actually uses
export const getEntryValue = (entry: BaseUser | ClubBaseUser) => {
  const clubEntry = entry as ClubBaseUser;
  return (
    clubEntry.rankScore ??
    clubEntry.fans ??
    clubEntry.cashouts ??
    clubEntry.points ??
    clubEntry.score ??
    clubEntry.tournamentWins ??
    null
  );
};
