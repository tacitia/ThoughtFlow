import json
import sys
from topia.termextract import tag
from topia.termextract import extract
import nltk

def uniqify(seq, idFun=None):
	# order preserving
	if idFun is None:
		def idFun(x): return x
		seen = {}
		result = []
		for item in seq:
			marker = idFun(item)
			if marker in seen: continue
		seen[marker] = 1
		result.append(item)
		return result
 
def build(language='english'):
	# initialize the tagger with the required language
	tagger = tag.Tagger(language)
	tagger.initialize()

	# create the extractor with the tagger
	extractor = extract.TermExtractor(tagger=tagger)
	# invoke tagging the text
	s = nltk.data.load('testDocument.txt',format = 'raw')
	extractor.tagger(s)
	# extract all the terms, even the "weak" ones
	extractor.filter = extract.DefaultFilter(singleStrengthMinOccur=2)
	# extract
	return extractor(s)

resultList = []

# get a results
result = build('english')

print result

# for r in result:
	# discard the weights for now, not using them at this point and defaulting to lowercase keywords/tags
	# resultList.append(r[0].lower())

#print resultList