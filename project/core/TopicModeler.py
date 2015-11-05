import numpy as np
import pandas as pd
import textmining
import lda
import lda.datasets
from nltk.corpus import stopwords

def compute_tdm(docs):
    # Create some very short sample documents
#    doc1 = 'The prefrontal cortex (PFC) subserves cognitive control: the ability to coordinate thoughts or actions in relation with internal goals. Its functional architecture, however, remains poorly understood. Using brain imaging in humans, we showed that the lateral PFC is organized as a cascade of executive processes from premotor to anterior PFC regions that control behavior according to stimuli, the present perceptual context, and the temporal episode in which stimuli occur, respectively. The results support an unified modular model of cognitive control that describes the overall functional organization of the human lateral PFC and has basic methodological and theoretical implications.'
#    doc2 = 'The prefrontal cortex (PFC) is central to flexible and organized action. Recent theoretical and empirical results suggest that the rostro-caudal axis of the frontal lobes may reflect a hierarchical organization of control. Here, we test whether the rostro-caudal axis of the PFC is organized hierarchically, based on the level of abstraction at which multiple representations compete to guide selection of action. Four functional magnetic resonance imaging (fMRI) experiments parametrically manipulated the set of task-relevant (a) responses, (b) features, (c) dimensions, and (d) overlapping cue-to-dimension mappings. A systematic posterior to anterior gradient was evident within the PFC depending on the manipulated level of representation. Furthermore, across four fMRI experiments, activation in PFC subregions was consistent with the sub- and superordinate relationships that define an abstract representational hierarchy. In addition to providing further support for a representational hierarchy account of the rostro-caudal gradient in the PFC, these data provide important empirical constraints on current theorizing about control hierarchies and the PFC.'
#    doc3 = 'Control regions in the brain are thought to provide signals that configure the brains moment-to-moment information processing. Previously, we identified regions that carried signals related to task-control initiation, maintenance, and adjustment. Here we characterize the interactions of these regions by applying graph theory to resting state functional connectivity MRI data. In contrast to previous, more unitary models of control, this approach suggests the presence of two distinct task-control networks. A frontoparietal network included the dorsolateral prefrontal cortex and intraparietal sulcus. This network emphasized start-cue and error-related activity and may initiate and adapt control on a trial-by-trial basis. The second network included dorsal anterior cingulate/medial superior frontal cortex, anterior insula/frontal operculum, and anterior prefrontal cortex. Among other signals, these regions showed activity sustained across the entire task epoch, suggesting that this network may control goal-directed behavior through the stable maintenance of task sets. These two independent networks appear to operate on different time scales and affect downstream processing via dissociable mechanisms.'
#    doc4 = 'Neuromodulators such as dopamine have a central role in cognitive disorders. In the past decade, biological findings on dopamine function have been infused with concepts taken from computational theories of reinforcement learning. These more abstract approaches have now been applied to describe the biological algorithms at play in our brains when we form value judgements and make choices. The application of such quantitative models has opened up new fields, ripe for attack by young synthesizers and theoreticians.'
    # Initialize class to create term-document matrix
    tdm = textmining.TermDocumentMatrix()
    # Add the documents
#    tdm.add_doc(doc1)
#    tdm.add_doc(doc2)
#    tdm.add_doc(doc3)
#    tdm.add_doc(doc4)
    for d in docs:
      tdm.add_doc(d)

    raw_matrix = list(tdm.rows(cutoff=2))

    filtered_matrix = filter_stopwords(raw_matrix)

    return filtered_matrix
#    return apply_tfidt_transform(raw_matrix)

def filter_stopwords(matrix):
	header = matrix[0]
	filtered_counts = [[row[col_idx] for col_idx in range(len(row)) if header[col_idx] not in stopwords.words('english')] for row in matrix[1:]]
	filtered_header = filter(lambda x: x not in stopwords.words('english'), header)

	return [filtered_header] + filtered_counts

def apply_tfidt_transform(matrix):
#	print matrix
	num_document = float(reduce(lambda x, y: x+1, matrix, 0))
	term_counts = [sum(row[col_idx] for row in matrix[1:]) for col_idx in range(len(matrix[0]))]

	for row in matrix[1:]:
		num_word = float(reduce(lambda x, y: x+y, row))
		for col_idx in range(len(row)):
			cell = row[col_idx]
			if cell != 0:
				term_occurrence = term_counts[col_idx]
				term_freq = cell / num_word
				inverse_doc_freq = np.log(abs(num_document / term_occurrence))
				row[col_idx] = term_freq * inverse_doc_freq

	return convert_to_positive_integer_matrix(matrix)

def convert_to_positive_integer_matrix(matrix):
	result = []
	term_counts = [sum(row[col_idx] for row in matrix[1:]) for col_idx in range(len(matrix[0]))]
	for row_idx in range(len(matrix)):
		new_row = []
		for col_idx in range(len(matrix[row_idx])):
			if  term_counts[col_idx] > 0:
				if row_idx == 0:
					new_row.append(matrix[row_idx][col_idx])
				else: 
					new_row.append(int(matrix[row_idx][col_idx] * 1000)) # should we actually try to infer this?
		result.append(new_row)

	return result

def fit_topic_model(tdm, vocab):
  print '>> fitting topic model...'
  n_doc = len(tdm)
  model = lda.LDA(n_topics=min(n_doc/10+2, 5), n_iter=100, random_state=1)
  model.fit(tdm)
  topic_word = model.topic_word_
  doc_topic = model.doc_topic_

  # take the top 8 words for each topic
  topics = []
  n_top_words = 8
  for i, topic_dist in enumerate(topic_word):
    topic_words = np.array(vocab)[np.argsort(topic_dist)][:-n_top_words:-1]
    # print('Topic {}: {}'.format(i, ' '.join(topic_words)))
    topics.append(topic_words.tolist())

  # print the topic for each document
  doc_topic_map = {}
  for n in range(n_doc):
    topic_most_pr = doc_topic[n].argmax()
    # print("doc: {} topic: {}\n".format(n, topic_most_pr))
    doc_topic_map[n] = topic_most_pr

  return topics, doc_topic_map

def run(docs):
  tdm = compute_tdm(docs)
  return fit_topic_model(np.array(tdm[1:]), tdm[0])


# Print out words with negative weight
#for col_idx in range(len(tdm[0])):
#	if tdm[1][col_idx] < 0:
#		print tdm[0][col_idx]