import xml.etree.ElementTree as ET
import sys, json
import pprint
import os

paper_file = open('AMier-Paper.txt')
venue = 'ACM Transactions on Computer-Human Interaction'

for line in paper_file:
  print line