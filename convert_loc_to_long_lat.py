import urllib2
import urllib
import StringIO
import json
import os
import time
#from stackoverflow
def format_address(address):
        addr = address.split(",")
        temp_addr = str(addr[0])
        temp_addr = temp_addr.split(os.sep)
        print temp_addr
        if len(temp_addr) == 2:
                return temp_addr[0] + " and " + temp_addr[1]
        else:
                return temp_addr[0]

def decodeAddressToCoordinates( address ):
        urlParams = {
                'address': address + " champaign urbana" ,
                'sensor': 'false',
        }  
        url = 'http://maps.google.com/maps/api/geocode/json?' + urllib.urlencode( urlParams )
        response = urllib2.urlopen( url )
        time.sleep(0.5)
        responseBody = response.read()

        body = StringIO.StringIO( responseBody )
        result = json.load( body )
        if 'status' not in result or result['status'] != 'OK':
                return None
        else:
                return {
                        'lat': result['results'][0]['geometry']['location']['lat'],
                        'lng': result['results'][0]['geometry']['location']['lng']
                }  

with open('2015_unofficial_crimes.json') as data_file:    
    data = json.load(data_file)



for datum in data["crimes"]:
        datum["location"] = decodeAddressToCoordinates(format_address(datum["arrest location"]))
        #setattr(datum,"location", decodeAddressToCoordinates(format_address(datum["arrest location"])) )
        print datum["location"]

with open('2015_unofficial_crimes_with_location.json', 'w') as outfile:
    json.dump(data, outfile)
#print decodeAddressToCoordinates(format_address("Fourth and Chamlmers champaign urbana"))