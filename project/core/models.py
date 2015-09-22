from django.db import models

class TextManager(models.Manager):
  def create_text(self, title, content, created_by):
    text = self.create(title=title, content=content, created_by=created_by)
    return text

class Text(models.Model):
  title = models.CharField(max_length=256) 
  content = models.TextField()
  created_by = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  objects = TextManager()

  def __unicode__(self):
      return self.title


class ConceptManager(models.Manager):
    def create_concept(self, term, created_by):
      concept = self.create(term=term, created_by=created_by)
      return concept

class Concept(models.Model):
  term = models.CharField(max_length=128)
  created_by = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  objects = ConceptManager()

  def __unicode__(self):
    return self.term


class EvidenceManager(models.Manager):
    def create_evidence(self, title, abstract, metadata, created_by):
      evidence = self.create(title=title, abstract=abstract, metadata=metadata, created_by=created_by)
      return evidence

class Evidence(models.Model):
  title = models.CharField(max_length=256) 
  abstract = models.TextField()
  metadata = models.TextField()
  created_by = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  objects = EvidenceManager()

  def __unicode__(self):
    return self.title


class Association(models.Model):
  TEXT = 'txt'
  CONCEPT = 'cnc'
  EVIDENCE = 'evd'
  TYPE_CHOICES = (
    (TEXT, 'text'),
    (CONCEPT, 'concept'),
    (EVIDENCE, 'evidence'),
  )

  sourceType = models.CharField(max_length=8, choices=TYPE_CHOICES)
  targetType = models.CharField(max_length=8, choices=TYPE_CHOICES)
  sourceId = models.IntegerField()
  targetId = models.IntegerField()
  created_by = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)