import pandas as pd
import matplotlib.pyplot as plt


locations = pd.read_csv("locations.csv")

print(locations["Game Date"], locations["SEASON"])



locations = locations[locations["Shot Zone Range"] != "Back Court Shot"]

# locations.drop(['Player Name','Team Name','Shot Zone Basic', 'Shot Zone Area',
#        'Shot Made Flag', 'Game Date', 'Season Type', 'GAME_DATE', 'SEASON'], axis=1, inplace=True)






def rep(row):

       x = row["Shot Zone Area"]
       y = row["Shot Zone Basic"]
       res = ""
       if x == "Center(C)":
              res += "c"
       if x == "Left Side Center(LC)":
              res += "lsc"
       if x == "Left Side(L)":
              res += "ls"
       if x == "Right Side Center(RC)":
              res += "rsc"
       if x == "Right Side(R)":
              res += "rs"
       if y == "Above the Break 3":
              res += "atb"
       if y == "In The Paint (Non-RA)":
              res += "itp"
       if y == "Left Corner 3":
              res += "lc"
       if y == "Mid-Range":
              res += "mr"
       if y == "Restricted Area":
              res += "ra"
       if y == "Right Corner 3":
              res += "rc"
       return res


locations["Location"] = locations.apply(lambda x: rep(x), axis=1)

locations.drop(["Game ID","Season Type",'Game Event ID', 'Player ID', 'Team ID',
       'Period', 'Minutes Remaining', 'Seconds Remaining',
       'Action Type', 'Shot Type',"Shot Zone Area", "Shot Zone Basic",
       'Shot Zone Range', 'Shot Distance', 'X Location', 'Y Location',
       'Home Team', 'Away Team',
       'GAME_ID', 'TEAM_ABBREVIATION_HOME',
       'TEAM_ABBREVIATION_AWAY', 'HOME_TEAM_ID', 'VISITOR_TEAM_ID',
       'Game Date', 'GAME_DATE'], axis=1, inplace=True)
locations.rename(columns={'Player Name': "player_name", "Team Name": "team_name",
                          "Location": "position", "Shot Made Flag": "made_flag",
                          "SEASON":"season"}, inplace=True)

locations_mini = locations[locations["season"] >= 2010]
locations_mini.to_csv("positions_2010-2019.csv", index=False)

locations.to_csv("positions.csv", index=False)
print(locations.head(10))

def foo(df, first, second, desc_f, desc_s):
    temp = df[first & second]
    if len(temp.index) == 0:
        return
    print("Shot Zone Area : ", desc_f, " , Shot Zone Basic: ", desc_s)
    print("Max X: ", temp["X Location"].max())
    print("Min X: ", temp["X Location"].min())
    print("Max Y: ", temp["Y Location"].max())
    print("Min Y: ", temp["Y Location"].min())


# print(locations.groupby(["Shot Zone Area"]).size())
# print(locations.groupby(["Shot Zone Range"]).size())
# print(locations.groupby(["Shot Zone Basic"]).size())

c = locations["Shot Zone Area"] == "Center(C)"
bc = locations["Shot Zone Area"] == "Back Court(BC)"
lsc = locations["Shot Zone Area"] == "Left Side Center(LC)"
ls = locations["Shot Zone Area"] == "Left Side(L)"
rsc = locations["Shot Zone Area"] == "Right Side Center(RC)"
rs = locations["Shot Zone Area"] == "Right Side(R)"

atb = locations["Shot Zone Basic"] == "Above the Break 3"
b = locations["Shot Zone Basic"] == "Backcourt"
itp = locations["Shot Zone Basic"] == "In The Paint (Non-RA)"
lc = locations["Shot Zone Basic"] == "Left Corner 3"
mr = locations["Shot Zone Basic"] == "Mid-Range"
ra = locations["Shot Zone Basic"] == "Restricted Area"
rc = locations["Shot Zone Basic"] == "Right Corner 3"

res = locations[c & atb]

sza = [c, bc, lsc, ls, rsc, rs]
sza_desc = ["Center(C)", "Back Court(BC)", "Left Side Center(LC)", "Left Side(L)", "Right Side Center(RC)",
            "Right Side(R)"]
szb = [atb, b, itp, lc, mr, ra, rc]
szb_desc = ["Above the Break 3", "Backcourt", "In The Paint (Non-RA)", "Left Corner 3", "Mid-Range", "Restricted Area",
            "Right Corner 3"]


def positions():
    for area_i in range(len(sza)):
        for basic_i in range(len(szb)):
            foo(locations, sza[area_i], szb[basic_i], sza_desc[area_i], szb_desc[basic_i])


tmp = locations[ls & itp]
tmp2 = locations[c & ra]
tmp3 = locations[ls & itp]
tmp4 = locations[rs & itp]

tmp.plot.scatter(x="X Location", y="Y Location", c='b')
tmp2.plot.scatter(x="X Location", y="Y Location", c='g')
tmp3.plot.scatter(x="X Location", y="Y Location", c='r')
tmp4.plot.scatter(x="X Location", y="Y Location", c='r')
plt.show(block=True)

tmp0 = tmp[tmp["X Location"] == -41]
tmp1 = tmp[tmp["X Location"] == 190]
tmp2 = tmp[tmp["X Location"] == 50]
tmp3 = tmp[tmp["Y Location"] == 225]
#
print(tmp0["Y Location"].mean())
print(tmp1["Y Location"].mean())
print(tmp2["Y Location"].mean())
print(tmp3["X Location"].mean())




print(len(locations[center & above].index))

print(xx.head(5))
