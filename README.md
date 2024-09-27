# THE FINALS API

This API is currently just a wrapper around the official THE FINALS leaderboard API from Embark.

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

To know which properties each leaderboard returns, just try it and see. The data returned is also explicitly defined in the folder [/src/transformers](https://github.com/leonlarsson/the-finals-api/tree/main/src/transformers).

#### Parameters

- `leaderboardVersion`: The leaderboard version. One of `cb1`, `cb2`, `ob`, `s1`, `s2`, `s3`, or `s3worldtour`. Always required. Note: There is also a `live` parameter, but this was a bad idea, so the `live` parameter will continue pointing at Season 2.
- `platform`: The platform. Only required for versions `ob`, `s1`, `s2`, and `s3` Needs to be one of `crossplay`, `steam`, `xbox`, or `psn`. However, `s3` and `s3worldtour` only support `crossplay`.

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
