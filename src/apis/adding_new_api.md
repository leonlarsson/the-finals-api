Dev Note:
To add a new leaderboard API, the following steps should be followed:

1. Add new schema file in the `src/schemas/leaderboard` directory.
2. Add leaderboard to `embarkApi` in `src/apis/embarkApi.ts`.
3. Add leaderboard to `src/apis/leaderboard.ts` using either `createLiveLeaderboard` or `createOldLeaderboard`. Live means Embark API is used to fetch the leaderboard.
4. If leaderboard has new properties, make sure to include them in `src/routes/clubs.ts` (`values`)

That's basically it.

To convert a live leaderboard to an old leaderboard, the following steps should be followed:
1. Change the `createLiveLeaderboard` function to `createOldLeaderboard` in `src/apis/leaderboard.ts`, no longer passing in `embarkApi`.
2. Remove leaderboard from `embarkApi` in `src/apis/embarkApi.ts`.