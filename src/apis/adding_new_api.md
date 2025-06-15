Dev Note:
To add a new leaderboard API, the following steps should be followed:

1. Add new schema file in the `src/schemas/leaderboard` directory.
2. Add leaaderboard to `embarkApi` in `src/apis/embarkApi.ts`.
3. Add leaderboard to `src/apis/leaderboard.ts`. Make sure to remove KV backups and change fetch to the standard KV fetch and add `cacheMinutes: oldLeaderboardCacheMinutes`
4. If leaderboard has new properties, make sure to include them in `src/routes/clubs.ts` (`values`)

That's basically it.