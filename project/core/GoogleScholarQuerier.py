import subprocess
import metapub
  
def getExcerpt(title):

  proc = subprocess.Popen(['python', 'core/scholar.py',  '-c', '1', '-p', '"' + title + '"'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
  results = proc.communicate()[0]

  lines = results.split('\n')
  excerpt = '' 
  for line in lines:
    line = line.strip()
    if line.startswith('Excerpt'):
      excerpt = line[8:]
  return excerpt


# Not implemented
def get_related_evidence(title):
  return []