import pandas as pd

pd.set_option('display.max_columns', None)
result = pd.read_csv("./details.csv", low_memory=False)

print(len(result.index))
print(result.keys())


# res = result.groupby(["team"])

def team_name(team):
    if team == "Charlotte Bobcats":
        return "Charlotte Hornets"
    if team == "New Jersey Nets":
        return "Brooklyn Nets"
    if team == "New Orleans Hornets":
        return "New Orleans Pelicans"
    return team


def season(date):
    month = int(date[5:7])
    year = int(date[0:4])

    if month < 8:
        return year + 1
    else:
        return year


index = 50000
print(season(result["date"][index]))
print(result["date"][index])

# result = result[result[""]]

result["season"] = result.apply(lambda x: int(season(x["date"])), axis=1)
result["team"] = result.apply(lambda x: team_name(x["team"]), axis=1)

result = result[result["season"] >= 2010]
result = result[result["season"] <= 2019]
result.drop(["FG", "FGA", "FG_PCT", "FG3", "FG3A", "FG3_PCT", "FT", "FTA", "FT_PCT", "ORB", "DRB",
             "PF", "PLUS_MINUS"], axis=1, inplace=True)

result.rename({"TRB": "REB"}, axis=1, inplace=True)

ress = result.groupby(["date", 'team'], as_index=False).agg({'REB': 'sum',
                                             'AST': 'sum',
                                             'STL': 'sum',
                                             'BLK': 'sum',
                                             'TOV': 'sum',
                                             'PTS': 'sum',
                                             'season': 'mean'})

res = ress.groupby(["season", 'team'], as_index=False).mean()


def round_pls(x):
    keys = x.keys()
    for key in keys:
        if len(key) < 4:
            x[key] = round(x[key], 2)
    # x['season'] = int(x['season'])
    return x


def correct_season(x):
    if x == 2014.5:
        return 2020
    else:
        return int(x)

res = res.apply(lambda x: round_pls(x), axis=1)
print(res.keys())


all_seasons = res.groupby(['team'], as_index=False).mean()

final = pd.concat([res, all_seasons])


final['season'] = final["season"].apply(lambda x: correct_season(x))
final = final.apply(lambda x: round_pls(x), axis=1)
print(len(final))




final.to_csv("team_details.csv", index=False)
