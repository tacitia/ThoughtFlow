import xml.etree.ElementTree as ET
import sys, json
import pprint
import os

def getElementValue(element):
  return None if element is None else element.text

def getElementArrayValue(element, name):
  return [] if element is None else [e.text for e in element.findall(name)]

def getEntries():
  entries = []
  for i in range(1,5):
    filename = 'core/xploreData/TVCGPubs' + str(i) + '.xml'
    tree = ET.parse(filename)
    root = tree.getroot()
    for child in root.findall('document'):
      title = child.find('title')
      abstract = child.find('abstract')
      if title is None or abstract is None:
        continue
      authors = child.find('authors')
      affiliations = child.find('affiliations')
      controlledterms = child.find('controlledterms')
      thesaurusterms = child.find('thesaurusterms')
      date = child.find('py')
      publicationId = child.find('publicationId')
      entries.append({
        'title': getElementValue(title),
        'authors': getElementValue(authors),
        'abstract': getElementValue(abstract),
        'affiliations': getElementValue(affiliations),
        'terms': getElementArrayValue(controlledterms, 'term') + getElementArrayValue(thesaurusterms, 'term'),
        'publicationId': getElementValue(publicationId),
        'date': getElementValue(date)
      })
  return entries