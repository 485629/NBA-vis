import pandas as pd

final = pd.read_csv("team_details.csv")

print(final.groupby(['team']).size())

seasons = {"2010": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0},
           "2011": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0},
           "2012": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0},
           "2013": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0},
           "2014": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0},
           "2015": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0},
           "2016": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0},
           "2017": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0},
           "2018": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0},
           "2019": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0},
           "2020": {"AST": 0, "BLK": 0, "PTS": 0, "REB": 0, "STL": 0, "TOV": 0}}

for s in seasons.keys():
    data = final[final["season"] == int(s)]
    for k in seasons[s].keys():
        seasons[s][k] = data[k].max()


def fix(x):
    season = str(x["season"])
    keys = x.keys()
    for key in keys:
        if len(key) < 4:

            x[key] = x[key] / seasons[season][key] * 100

            x[key] = round(x[key], 2)

    # x['season'] = int(x['season'])
    return x


finals = final.apply(lambda x: fix(x), axis=1)

finals.to_csv("team_details_final.csv", index=False)
