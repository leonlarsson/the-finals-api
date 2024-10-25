# THE FINALS API

This API provides leaderboard data from all leaderboards of [THE FINALS](https://www.reachthefinals.com/).

### Usage

There are two endpoints, `/v1/leaderboard/:id/:platform?` and `/v1/community-event/:id/:platform?`.

To see which properties each endpoint and leaderboard return, visit https://api.the-finals-leaderboard.com/. The data returned is also explicitly defined in the folder [/src/schema](https://github.com/leonlarsson/the-finals-api/tree/main/src/schemas).

#### Parameters

- `id`: The leaderboard version. Always required.
- `platform`: The platform. Only required for some version. Visit https://api.the-finals-leaderboard.com/ to see which platforms are available for each version.

#### Query Parameters

- `count`: If set to `true`, the API will only return the number of entries in the leaderboard after filters have been applied. Defaults to `false`
- `name`: If set, the API will only return entries whose name matches the given string. Performs a case-insensitive against all the user's names.

### Examples

#### Get all players from the first Closed Beta leaderboard who have "fish" in their name:

`https://api.the-finals-leaderboard.com/v1/leaderboard/cb1?name=fish`

#### Get only the number of Steam players from the Open Beta leaderboard who have "ttv" in their name

`https://api.the-finals-leaderboard.com/v1/leaderboard/ob/steam?count=true&name=ttv`

#### Get the data from the Season 1 crossplay leaderboard

`https://api.the-finals-leaderboard.com/v1/leaderboard/s1/crossplay`

#### Get the data from the Season 2 Xbox leaderboard

`https://api.the-finals-leaderboard.com/v1/leaderboard/s2/xbox`

#### Get the data from the Season 3 crossplay leaderboard

`https://api.the-finals-leaderboard.com/v1/leaderboard/s3/crossplay`

#### Get the data from the Season 4 crossplay leaderboard

`https://api.the-finals-leaderboard.com/v1/leaderboard/s4/crossplay`

#### Get the data from Community Event 4.4

`https://api.the-finals-leaderboard.com/v1/community-event/ce44`