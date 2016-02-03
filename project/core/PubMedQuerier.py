# -*- coding: utf-8 -*-

# this script is called when
# 1. KnowledgeNet receives initial queries provided by the user
# 2. The association builder is extending the concept graph

import subprocess
import os.path
import PubMedParser
from time import sleep
import operator
import linecache
import metapub
import math
from nltk.metrics import edit_distance
import sys

# This new function using the metapub library instead of custom PubMed query methods (the latter is hackier)
def get_abstract_by_title(title):
	print '>>>>>>>>>>>>>>>>>>>>>>>>>>'
	print 'searching entry with title: ' + title
	fetch = metapub.PubMedFetcher()
	pmids = fetch.pmids_for_query(title)
	if (len(pmids) == 0):
		print 'warning: no entry retrieved for given title'
		return None, ''
	elif (len(pmids) == 1):
		article = fetch.article_by_pmid(pmids[0])
		if edit_distance(article.title, title) <= math.ceil(len(title) * 0.1) and article.abstract != None:
			print 'successfully matched title: ' + article.title
			return article.title, article.abstract
		else:
			print 'warning: found one entry but not a match'		
			return None, ''
	else:
		print 'warning: retrieved more than one entry for given title'
		for i in range(min(20, len(pmids))):
			article = fetch.article_by_pmid(pmids[i])
			if edit_distance(article.title, title) <= math.ceil(len(title) * 0.1) and article.abstract != None:
				print 'successfully matched title: ' + article.title
				return article.title, article.abstract
		print 'warning: no entry is a match'
		return None, ''

def get_related_evidence(title):
	print '>>>>>>>>>>>>>>>>>>>>>>>>>>'
	try:
		print 'given title: ' + title
	except UnicodeEncodeError:
		print 'title cannot be printed - containing unicode encode error'
		pass
	fetch = metapub.PubMedFetcher()
	pmids = fetch.pmids_for_query(title)
	if len(pmids) == 1:
		article = fetch.article_by_pmid(pmids[0])
		if edit_distance(article.title, title) <= len(title) * 0.1:
			print 'matched title: ' + article.title
			related_pmids = fetch.related_pmids(pmids[0])
			return _merge_related_pmids(related_pmids, fetch)
	elif len(pmids) > 1:
		for i in range(min(20, len(pmids))):
			article = fetch.article_by_pmid(pmids[i])
			if edit_distance(article.title, title) <= len(title) * 0.1:
				print 'matched title: ' + article.title
				related_pmids = fetch.related_pmids(pmids[i])
				return _merge_related_pmids(related_pmids, fetch)

	print 'no match found'
	return []

def _merge_related_pmids(related_pmids, fetch):
	results = []
	if 'five' in related_pmids:
		results += related_pmids['five']
	if 'refs' in related_pmids:
		results += related_pmids['refs']
	if 'alsoviewed' in related_pmids:
		results += related_pmids['alsoviewed']
	if 'reviews' in related_pmids:
		results += related_pmids['reviews']
	if 'citedin' in related_pmids and related_pmids['citedin'] < 200:
		results += related_pmids['citedin']
	results = list(set(results))
	articles = []
	for pmid in results:
		try:
			article = fetch.article_by_pmid(pmid)
			if article.abstract != None:
				articles.append(article)
		except metapub.exceptions.InvalidPMID:
			print ("Exception: ", sys.exc_info()[0])
			continue
	return articles


# Takes the query and 
# 1) writes the query result into savefile
# 2) writes information about the requery result (how many results )
def query_pubmed(param, savefile, logfile):
	print 'Query: ' + param
	if os.path.isfile(savefile):
		print 'file exists, skip query'
		return
	perl_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'download_pub.pl')
	pipe = subprocess.Popen(['perl', perl_path, param, savefile, '250', logfile], stdin=subprocess.PIPE)
	pipe.wait()
	
# seems like Esearch does search differently from the pubmed search bar. Sometimes a title query yields 
# no results while pubmed search can return an exact match...assigning low priority to this issue
# Example: Rostral–caudal gradients of abstraction revealed by multivariate pattern analysis of working memory
def convert_title_to_query_param(input):
	result = input
	result = result.replace(' ', '+')
	return result
	
def convert_concept_to_query_param(input):
	result = input
	result = result.replace('"', '%22') # need to double check if this is necessary
	return result

def download_records(input, prefix):
	# issue query for each publication; cannot post more than 3 queries per second!
	titles = input.split('\n')
	filenames = []
	for i, t in enumerate(titles):
		param = convert_title_to_query_param(t)
		f = os.path.join(os.path.dirname( os.path.realpath(__file__)), 'queryresults', prefix + '_' + str(i) + '.txt')
		logfile = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'queryresults', prefix + '_' + str(i) + '_log' + '.txt')
		query_pubmed(param, f, logfile)
		filenames.append(f)
		sleep(0.5)	
	return filenames

def extract_terms_for_titles(titles, min_repeat=0):
	# todo: auto increment this
	query_id = '1'
	filenames = download_records(titles, 'query_' + query_id)
#	keywords = PubMedParser.extract_all_keywords(filenames)
	keywords = PubMedParser.extract_repeated_keywords(filenames, min_repeat)
#	keywords = PubMedParser.extract_all_mesh(filenames)
	return keywords

def find_neighbors_for_terms(terms, num_neighbors=10, user_id=1):
	query = ''
	for t in terms:
		query += t + ' '
	current_dir = os.path.dirname(os.path.realpath(__file__))
	f = os.path.join(current_dir, 'queryresults', query + '.txt')
	logfile = os.path.join(current_dir, 'queryresults', query + '_log' + '.txt')
	query_pubmed(query, f, logfile)
	keywords = PubMedParser.extract_repeated_keywords([f], terms, threshold=10)
	PubMedParser.load_evidence(f)
	sorted_keywords = sorted(keywords.items(), key=operator.itemgetter(1), reverse=True)
	num_keywords_all = len(sorted_keywords)
	pub_counts = read_counts(logfile)
	pub_counts['keyword_count'] = num_keywords_all
	pub_counts['showing_count'] = num_neighbors 
	return {'keywords': sorted_keywords[:num_neighbors], 'log': pub_counts}

# If skip_no_abstract is True, ask load_evidence to skip publications with no abstract
def find_evidence_for_terms(terms, skip_no_abstract=False, user_id=1):
	print '>> finding evidence for terms...'
	query = ' '.join(terms)
	current_dir = os.path.dirname(os.path.realpath(__file__))
	f = os.path.join(current_dir, 'queryresults', query + '.txt')
	logfile = os.path.join(current_dir, 'queryresults', query + '_log' + '.txt')
	query_pubmed(query, f, logfile)
	return PubMedParser.load_evidence(f, skip_no_abstract)

def search_pubs(query, num_pubs=50):
	f = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'queryresults', query + '.txt')
	logfile = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'queryresults', query + '_log' + '.txt')
	query_pubmed(query, f, logfile)
	contents = PubMedParser.read_contents(f, num_pubs)
	pub_counts = read_counts(logfile)
	pub_counts['showing_count'] = num_pubs
	return {'contents': contents, 'log': pub_counts}

def read_counts(logfile):
	orig_count = linecache.getline(logfile, 1)
	count = linecache.getline(logfile, 2)	
	return {'orig_count': orig_count, 'count': count}


