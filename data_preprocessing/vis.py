import pandas as pd

_2000 = pd.read_csv("seasons/2000.csv")
_2001 = pd.read_csv("seasons/2001.csv")
_2002 = pd.read_csv("seasons/2002.csv")
_2003 = pd.read_csv("seasons/2003.csv")
_2004 = pd.read_csv("seasons/2004.csv")
_2005 = pd.read_csv("seasons/2005.csv")
_2006 = pd.read_csv("seasons/2006.csv")
_2007 = pd.read_csv("seasons/2007.csv")
_2008 = pd.read_csv("seasons/2008.csv")
_2009 = pd.read_csv("seasons/2009.csv")
_2010 = pd.read_csv("seasons/2010.csv")
_2011 = pd.read_csv("seasons/2011.csv")
_2012 = pd.read_csv("seasons/2012.csv")
_2013 = pd.read_csv("seasons/2013.csv")
_2014 = pd.read_csv("seasons/2014.csv")
_2015 = pd.read_csv("seasons/2015.csv")
_2016 = pd.read_csv("seasons/2016.csv")
_2017 = pd.read_csv("seasons/2017.csv")
_2018 = pd.read_csv("seasons/2018.csv")
_2019 = pd.read_csv("seasons/2019.csv")


frames = [
    _2000,
    _2001,
    _2002,
    _2003,
    _2004,
    _2005,
    _2006,
    _2007,
    _2008,
    _2009,
    _2010,
    _2011,
    _2012,
    _2013,
    _2014,
    _2015,
    _2016,
    _2017,
    _2018,
    _2019]

result = pd.concat(frames)

result.to_csv("seasons/details.csv", index=False)
