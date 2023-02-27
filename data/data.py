import pandas as pd
loc = "./data/"
filee = "exoplanets-1"

df = pd.read_excel(f'{loc}{filee}.xlsx')


# # make basic csv
# df.to_csv(f"{loc}exo-all.csv",index=True)

# exo_sun = df[["pl_name","sy_snum"]]
# exo_sun.to_csv(f"{loc}exo-sun.csv",index=False)

# exo_planet = df[["pl_name","sy_pnum"]]
# exo_planet.to_csv(f"{loc}exo-planet.csv",index=False)

# exo_suntype = df[["pl_name","st_spectype"]]
# exo_suntype.to_csv(f"{loc}exo-suntype.csv",index=False)


# print(exo_suntype)


def getTotalP(df):

    totalp = {'A':0, 'F':0, 'G':0, 'K':0, 'M':0, 'Missing': 0} #'O':0, 'B':0, 

    for a in df["st_spectype"]:
        if type(a) == float:
            totalp['Missing'] += 1
        else:
            for b in totalp:
                if b != "Missing":
                    if b in a:
                        totalp[b] += 1
                        break        
    return(totalp)


def getNumberOfThingInSystem(data):
    numberOfThingsInSystem = {}

    for a in data:
        if a not in numberOfThingsInSystem:
            numberOfThingsInSystem[a] = 1
        else:
            numberOfThingsInSystem[a] += 1

    return(numberOfThingsInSystem)


def getHabitable(df):

    totalp = {'A':{"inner": 8.5, "outer": 12.5}, 
              'F':{"inner": 1.5, "outer": 2.2}, 
              'G':{"inner": 0.95, "outer": 1.4},
              'K':{"inner": 0.38, "outer": 0.56},
              'M':{"inner": 0.08, "outer": 0.12}}

    habit = {'A':0, 'F':0, 'G':0, 'K':0, 'M':0}
    nohabit = {'A':0, 'F':0, 'G':0, 'K':0, 'M':0}

    for sptype, rad in zip(df["st_spectype"],df['st_rad']):
        if type(sptype) != float:
            for b in totalp:
                if b in sptype:
                    if (totalp[b]["outer"] > rad > totalp[b]["inner"]):
                        habit[b] += 1
                    else:
                        nohabit[b] += 1
                    break
                    
                


    return(habit,nohabit)





# # how many exoplanets are from systems with 1 star, 2 stars, 3 stars, and so on
# print(getNumberOfThingInSystem(df["sy_snum"]))
# # how many exoplanets are in systems with 1 planets, 2 planets, 3 planets and so on 
# print(getNumberOfThingInSystem(df["sy_pnum"]))
# # how many exoplanets orbit stars of different types:
# print(getTotalP(df))
# # how many exoplanets were discovered by different methods
# print(getNumberOfThingInSystem(df["discoverymethod"]))
# # how many exoplanets are within a habitable zone vs outside the habitable zone.   
print(getHabitable(df))

# # Allow users to see the distribution of exoplanets by their distance to us
# # A histogram is a good choice for these visualizations.  You may use other approaches- see note below.
# # Enable the user to see exoplanet discoveries over time (by year). 
# # They should be able to identify the trends in the discoveries. 
# # A line chart is a good choice for this.  You may use other approaches- see note below.
# # Show the relationships between exoplanet radius and mass 
# # Also show the planets from our solar system, highlighted though a distinct color and label them.  
# # Consider whether to use a linear or logarithmic scale
# # A scatterplot is a good choice for this.  You may use other approaches- see note below.

# snum = pd.DataFrame.from_dict({"Star_num":getNumberOfThingInSystem(df["sy_snum"]),"Planet_num": getNumberOfThingInSystem(df["sy_pnum"])})
# snum.to_csv(f"{loc}exo-snum.csv",index=True)