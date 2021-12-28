import numpy as np
import pandas as pd
import sqlite3
from pandas_profiling import ProfileReport


path = "./"  # Everything preceding the file name
database = path + 'basketball.sqlite'  # The path + the file name

conn = sqlite3.connect(database)
games = pd.read_sql("""SELECT * FROM Game ; """, conn)

games["GAME_ID"] = games["GAME_ID"].apply(lambda x: x[2:])
frames = [games["GAME_ID"], games["TEAM_ABBREVIATION_HOME"], games["GAME_DATE"], games["TEAM_ABBREVIATION_AWAY"],
          games["HOME_TEAM_ID"], games["VISITOR_TEAM_ID"], games["SEASON"]]

res = pd.concat(frames, axis=1)

# res["SEASON"] = res["SEASON"].apply(lambda x: int(x))
#
# res = res[res["SEASON"] > 1999]

locations = pd.read_csv("location.csv")

locations.dropna(axis=0, how='any', inplace=True)
res.dropna(axis=0, how='any', inplace=True)


res["GAME_ID"] = res["GAME_ID"].apply(lambda x: int(x))
locations["Game ID"] = locations["Game ID"].apply(lambda x: int(x))

ress = locations.merge(res, how="left", left_on="Game ID", right_on="GAME_ID")

# print(ress.isnull().sum())
# print(len(ress.index))

ress.dropna(axis=0, how='any', inplace=True)

ress["SEASON"] = ress["SEASON"].apply(lambda x: int(x))

ress = ress[ress["SEASON"] < 2020]
ress = ress[ress["SEASON"] > 1999]

# print(len(ress.index))
# print(ress.head(5))

print(ress.groupby(["Shot Zone Area"]).size())
print(ress.groupby(["Shot Zone Range"]).size())
print(ress.groupby(["Shot Zone Basic"]).size())

ress.to_csv("locations.csv", index=False)
