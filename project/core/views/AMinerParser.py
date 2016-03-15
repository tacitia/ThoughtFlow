import xml.etree.ElementTree as ET
import sys, json
import pprint
import os

paper_file = open('core/views/AMiner/AMiner-Paper.txt')
#paper_file = open('AMiner/AMiner-Paper.txt')

def construct_maps():
  index_title_map = {}
  index_include_map = {}
  paper_file.seek(0)
  counter = 0
  index = ''
  title = ''
  venue = ''
  for line in paper_file:
    if line.startswith('#index'):
      index = line.strip().replace('#index ', '')
      counter += 1
      print counter
    elif line.startswith('#*'):
      title = line.strip().replace('#* ', '')
    elif line.startswith('#c'):
      venue = line.strip().replace('#c ', '')
    elif line.startswith('#!'):
      abstract = line.strip().replace('#! ', '')
    elif line.startswith('#'):
      continue
    else:
      index_title_map[index] = title
      index_include_map[index] = False
      if (('CHI' in venue and 'ICHIT' not in venue) or 'TOCHI' in venue) and len(abstract) > 0:
        index_include_map[index] = True      
      index = ''
      title = ''
      venue = ''

  return index_title_map, index_include_map

def getCitations():
  index_title_map, index_include_map = construct_maps()
  citations = []
#  out_file = open('core/views/AMiner/AMiner-Citation-HCI.txt', 'w')
  index = ''
  title = ''
  venue = ''
  counter = 0
  paper_file.seek(0)
  for line in paper_file:
    if line.startswith('#index'):
      index = line.strip().replace('#index ', '')
      counter += 1
    elif line.startswith('#*'):
      title = line.strip().replace('#* ', '')
    elif line.startswith('#c'):
      venue = line.strip().replace('#c ', '')
    elif line.startswith('#%'):
      ref = line.strip().replace('#% ', '')
      if index_include_map[index] and index_include_map[ref]:
        citations.append({
          'paper': title,
          'citation': index_title_map[ref]
        })
    elif line.startswith('#'):
      continue
    else:
      print counter
      print citations
      index = ''
      title = ''

  return entries

def getEntries():
  entries = []
  out_file = open('core/views/AMiner/AMiner-Paper-HCI.txt', 'w')

  index = ''
  title = ''
  authors = ''
  affiliations = ''
  year = ''
  venue = ''
  ref = ''
  abstract = ''
  counter = 0

  venues = []

  for line in paper_file:
    if line.startswith('#index'):
      index = line.strip().replace('#index ', '')
      counter += 1
    elif line.startswith('#*'):
      title = line.strip().replace('#* ', '')
    elif line.startswith('#@'):
      authors = line.strip().replace('#@ ', '')
    elif line.startswith('#o'):
      affiliations = line.strip().replace('#o ', '')
    elif line.startswith('#t'):
      year = line.strip().replace('#t ', '')
    elif line.startswith('#c'):
      venue = line.strip().replace('#c ', '')
    elif line.startswith('#%'):
      ref = line.strip().replace('#% ', '')
    elif line.startswith('#!'):
      abstract = line.strip().replace('#! ', '')
    else:
      print counter
      if (('CHI' in venue and 'ICHIT' not in venue) or 'TOCHI' in venue) and len(abstract) > 0:
        entry = {
          'title': title,
          'authors': authors,
          'abstract': abstract,
          'affiliations': affiliations,
          'index': index,
          'date': year,
          'venue': venue
        }
        print entry
        entries.append(entry)
      index = ''
      title = ''
      authors = ''
      affiliations = ''
      year = ''
      venue = ''
      ref = ''
      abstract = ''
  return entries

# getCitations()
# pp = pprint.PrettyPrinter(indent=4)
# pp.pprint(getEntries())
