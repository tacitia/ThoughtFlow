# Term extracter based on topic modeling
# How is this useful?
# - PubMed articles are indexed by MeSH terms. However, user-generated texts are not. While we can use the topia 
# - library to extract terms, there tend to be a large and noise set of terms. We want to be able to have a more 
# - concise set of concepts that we can use to retrieve relevant evidence and concepts.
# - based on http://www.ics.uci.edu/~newman/pubs/Newman-AI09.pdf

import json
import sys
from topia.termextract import tag
from topia.termextract import extract
import nltk

