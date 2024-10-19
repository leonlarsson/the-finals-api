# THE FINALS API

This API provides leaderboard data from all leaderboards of [THE FINALS](https://www.reachthefinals.com/).

### Usage

There is a single endpoint, `/v1/leaderboard/:leaderboardVersion/:platform?`, which returns a JSON object. The standard is the following:

```json
{
    "meta": {
        "leaderboardVersion": "s3",
        "leaderboardPlatform": "crossplay",
        "...chosen parameters"
    },
    "count": "amount of entries in 'data'",
    "data": [
        {
            "rank": 1,
            "...rest of player data"
        }
    ]
}
```

To know which properties each leaderboard returns, visit https://api.the-finals-leaderboard.com/. The data returned is also explicitly defined in the folder [/src/schema](https://github.com/leonlarsson/the-finals-api/tree/main/src/schemas).

#### Parameters

- `leaderboardVersion`: The leaderboard version. One of `cb1`, `cb2`, `ob`, `s1`, `s2`, `s3`, `s3worldtour`, `s4`, `s4worldtour`, `s4sponsor`, `the-finals`, or `orf`. Always required.
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
