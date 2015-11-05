# take a set of pubmed records downloaded using medline option, and extract all keywords
from collections import Counter
from core.models import Concept, Evidence, Association
from fuzzywuzzy import fuzz
import re
import json

def extract_all_keywords(filenames):
	results = []
	for filename in filenames:
		input_file = open(filename, 'r')
		keywords = [line.split('- ')[1].strip() for line in input_file if line.startswith('OT  ')]	
		results += list(set(keywords))
	return results


def extract_all_mesh(filenames):
	results = []
	for filename in filenames:
		input_file = open(filename, 'r')
		meshs = [line.split('- ')[1].strip() for line in input_file if line.startswith('MH  ')]	
		results += list(set(meshs))
	return results
	
# returns keyword extracted for the best match to the given title; if no good match, return None
def extract_best_match_keywords(filename, title):
	best_match = {
		score: 0,
		title: None,
		keywords: [],
		flag: False
	}
	input_file = open(filename, 'r')
	for line in input_file:
		if line.startswith('TI'):
			current = line.split('- ')[1].strip()
			score = fuzz.ratio(current, title)
			best_match[score] = score if score > best_match[score] else best_match[score]
			best_match[title] = current if score > best_match[score] else best_match[title]
			best_match[keywords] = [] if score > best_match[score] else best_match[keywords]
			best_match[flag] = True if score > best_match[score] else False
		if line.startswith('OT') and best_match[flag]:
			best_match[keywords].append(line.split('- ')[1].strip())
	if best_match[score] > 85:
		return best_match_keywords
	else:
		return None
	
# return the keywords that have repeated in a certain number of records
# TODO: change the implementation so that it operates directly on evidence objects 
# loaded using load_evidence
def extract_repeated_keywords(filenames, source, threshold=0):
	keywords = []
	num_record = 0

	for filename in filenames:
		print filename
		input_file = open(filename, 'r')
		for line in input_file:
			if line.startswith('TI'):
				num_record += 1
			if line.startswith('OT'):
				k = line.split('- ')[1].strip()
				if k != 'NOTNLM':
					keywords.append(k)
	keyword_counts = Counter(keywords)
	keyword_counts = merge_terms(keyword_counts, source)
	return {key: keyword_counts[key] for key in keyword_counts if keyword_counts[key] > threshold}


def merge_terms(terms, source):
	results = {}
	for key in terms.keys():
		newkey = key.lower()
		toSkip = False
		for r in source:
			if r.lower() == newkey or newkey in r.lower():
				toSkip = True # skip the terms that are the same as or a substring of the sources
		if toSkip:
			continue
		if newkey in results:
			results[newkey] += terms[key]
		else:
			results[newkey] = terms[key]
	return results

# quick and dirty processing of PubMed entries
def load_evidence(filename, skip_no_abstract=False):
	print '>> loading evidence...'
	pubfile = open(filename)
	prev_field = ''
	current_entry = {}
	loaded_evidence = []
	for line in pubfile:
		label = line[:4].strip()
		if label != '':
			prev_field = label
		content = line[6:].strip()

		if label =='PMID':
			if 'PMID' in current_entry:
				if not skip_no_abstract or current_entry['AB'] != '':
					evidence = Evidence.objects.create_evidence(current_entry['TI'], current_entry['AB'], json.dumps({
						'PMID': current_entry['PMID'],
						'AUTHOR': ' and '.join(current_entry['AU']),
						'JOURNAL': current_entry['JT'],
						'DATE': current_entry['DP'],
						'AFFILIATION': current_entry['AD']
					}), 0)
					loaded_evidence.append(evidence)
					for k in current_entry['OT']:
						concept = Concept.objects.create_concept(k, 0)
						Association.objects.create_association('concept', 'evidence', concept.id, evidence.id, 0)
			current_entry = {}
			current_entry['PMID'] = content
			current_entry['AU'] = []
			current_entry['OT'] = []
			current_entry['TI'] = ''
			current_entry['AB'] = ''
			current_entry['DP'] = ''
			current_entry['AD'] = ''
			current_entry['JT'] = ''
		elif label == '' and re.match('PMID|TI|AB|DP|AD|JT|AU', prev_field):
			current_entry[prev_field] += ' ' + content
		elif re.match('TI|AB|DP|AD|JT', label):
			current_entry[label] = content
		elif label == 'AU' or label == 'OT':
			current_entry[label].append(content)
	return loaded_evidence

# deprecated	
#def read_contents(filename):
#	contents = ''
#	pubfile = open(filename)
#	for line in pubfile:
#		if re.match('PMID|TI|AB|DP|AU|AD|JT|OT|\n', line):
#			contents += line
#	return contents

