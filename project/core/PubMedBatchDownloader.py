import os
import subprocess

def download(query):
	current_dir = os.path.dirname(os.path.realpath(__file__))
	savefile = os.path.join(current_dir, 'batchresults', query + '.txt')
	logfile = os.path.join(current_dir, 'batchresults', query + '_log.txt')
	perl_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'download_pub.pl')
	pipe = subprocess.Popen(['perl', perl_path, query, savefile, '-1', logfile], stdin=subprocess.PIPE)
	pipe.wait()

download('"cognitive effort"')