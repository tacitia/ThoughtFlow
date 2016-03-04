#!/usr/bin/python
import sys
import pprint

if len(sys.argv) == 1:
  print 'Usage: python bibtex-venue-counter.py path-to-bibtex-file'
  sys.exit(0)

bibfilename = sys.argv[1]

venuedict = {}

with open(bibfilename) as infile:
  for line in infile:
    if line.strip().startswith('journal'):
      venue = line.split('=')[1].strip()
      venue = venue.replace('{', '')
      venue = venue.replace('}', '')
      venue = venue.replace(',', '')
      venue = venue.replace('"', '')
      venue = venue.replace('"', '')      
      venue = venue.lower()
      if venue not in venuedict:
        venuedict[venue] = 1
      else:
        venuedict[venue] += 1

print 'total venues: ' + str(len(venuedict.keys()))
pp = pprint.PrettyPrinter(indent=4)
pp.pprint(venuedict)