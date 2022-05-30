import requests
import json
from bs4 import BeautifulSoup

session = "1225" #replace with the session number shown on the opening screen
#level = "under" #replace "under" with "grad" for the grad courses
#subject = "AFM" #replace "AMATH" with the subject

room_time_dict = {}

levels = ["under", "grad"]

subjects = ["ACC", "ACINTY", "ACTSC", "AE", "AFM", "AHS", "AMATH", "ANTH", 
"APPLS", "ARABIC", "ARBUS", "ARCH", "ARTS", "ASL", "ASTRN", "AVIA", "BASE", 
"BE", "BET", "BIOL", "BME", "BUS", "CC", "CDNST", "CFM", "CHINA", "CI", "CIVE", 
"CLAS", "CM", "CMW", "CO", "COGSCI", "COMM", "COOP", "CROAT", "CS", "CT", "DAC", "DATSC", 
"DEI", "DUTCH", "EARTH", "EASIA", "ECDEV", "ECE", "ECON", "EDMI", "ELPE", "EMLS", "ENBUS", 
"ENGL", "ENTR", "ENVE", "ENVS", "ERS", "FILM", "FINE", "FR", "GBDA", "GEMCC", "GENE", "GEOE", 
"GEOG", "GER", "GERON", "GGOV", "GLOBAL", "GRK", "GS", "GSJ", "HESC", "HIST", "HLTH", "HRM",   
"HRTS", "HUMSC", "INDENT", "INDEV", "INDG", "INTEG", "INTST", "ITAL", "ITALST", "JAPAN", "JS", 
"KIN", "KOREA", "KPE", "LAT", "LS", "MATBUS", "MATH", "ME", "MEDVL", "MENN", "MGMT", "MLST", "MNS", 
"MOHAWK", "MSCI", "MTE", "MTHEL", "MUSIC", "NANO", "NAST", "NE", "OPTOM", "PACS", "PD", "PDARCH", 
"PDPHRM", "PHARM", "PHIL", "PHYS", "PLAN", "PMATH", "PORT", "PS", "PSCI", "PSYCH", "QIC", "REC", 
"REES", "RELC", "RS", "RSCH", "RUSS", "SCBUS", "SCI", "SDS", "SE", "SEQ", "SI", "SMF", "SOC", 
"SOCWK", "SPAN", "SPCOM", "STAT", "STV", "SUSM", "SVENT", "SWK", "SWREN", "SYDE", "TAX", "THPERF",
"TN", "TPM", "TS", "UN", "UNIV", "UU", "VCULT", "WATER", "WHMIS", "WKRPT", "WS"]

for level in levels:
    for subject in subjects:
        data = {
            "level": level, 
            "sess": session, 
            "subject": subject 
        }

        url = "https://classes.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl"
        altUrl = "https://classes.uwaterloo.ca/under.html"
        response = requests.post(url, data=data) 
        soup = BeautifulSoup (response.text, 'html.parser')


        #print(response.text)
        #table_list = soup.find_all('table')

        #find from 1 to length-1 in find_all('table)
        #and in each table find the find_all ('tr') from 1 to length
        #and in each tr find the td in index11 and index 10
        table = soup.find_all('table')



        for x in range(1, len(table)):
            rows = table[x].find_all('tr')
            for y in range (1, len(rows)):
                #if length of rows[y].find_all('td') is less than 10 then skip/continue
                if len(rows[y].find_all('td')) >= 12 and rows[y].find_all('td')[11].text != "Online" and rows[y].find_all('td')[11].text.strip(): 
                    room = rows[y].find_all('td')[11].text
                    time = rows[y].find_all('td')[10].text
                    if room in room_time_dict.keys():
                        room_time_dict[room].append(time)
                    else: #room not in room_time_dict.keys()
                        room_time_dict[room] = [time]
                    #print(rows[y].find_all('td')[11].text, ",", rows[y].find_all('td')[10].text)

    #print(soup.find_all('table')[2].find_all('tr')[1].find_all('td')[10])

with open("data.json", "w") as fp:
    json.dump(room_time_dict, fp, indent=4, sort_keys = True)
  

print(room_time_dict)
