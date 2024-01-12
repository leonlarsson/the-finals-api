# THE FINALS API

This API is currently just a wrapper around the official THE FINALS leaderboard API from Embark.

### Usage

There is a single endpoint, `/v1/leaderboard/leaderboardVersion/platform?`, which returns a JSON object.

#### Parameters

- `leaderboardVersion`: The leaderboard version. One of `cb1`, `cb2`, `ob`, or `live`. Always required
- `platform`: The platform. Only required for versions `ob`, and `live`. Needs to be one of `crossplay`, `steam`, `xbox`, or `psn`

#### Query Parameters

- `raw`: If set to `true`, the API will return the raw, untransformed leaderboard data. Defaults to `false`, which returns appropriately named properties
- `count`: If set to `true`, the API will only return the number of entries in the leaderboard after filters have been applied. Defaults to `false`
- `name`: If set, the API will only return entries whose name matches the given string

### Examples

#### Get all players from the first Closed Beta leaderboard

`https://api.the-finals-leaderboard.com/v1/leaderboard/cb1`

#### Get only the number of Steam players from the Open Beta leaderboard that have "ttv" in their name

`https://api.the-finals-leaderboard.com/v1/leaderboard/ob/steam?count=true&name=ttv`

#### Get the raw data from the Live crossplay leaderboard

`https://api.the-finals-leaderboard.com/v1/leaderboard/live/crossplay?raw=true`
