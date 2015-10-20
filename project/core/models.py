from django.db import models

class TextManager(models.Manager):
  def create_text(self, title, content, created_by):
    text, created = self.get_or_create(title=title, content=content, created_by=created_by)
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
      concept, created = self.get_or_create(term=term, created_by=created_by)
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
      evidence, created = self.get_or_create(title=title, abstract=abstract, metadata=metadata, created_by=created_by)
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
    return self.title + ' ' + self.metadata


class AssociationManager(models.Manager):
  def create_association(self, sourceType, targetType, sourceId, targetId, created_by):
    association, created = self.get_or_create(sourceType=sourceType, targetType=targetType, sourceId=sourceId, targetId=targetId, created_by=created_by)
    return association

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
  # How strong the association is; if the association is added by the user, the strength is 0, which actually means the strongest
  # association; for concepts and concepts, the strength is the # of co-occurrences divided by the total # of publications seen 
  # (larger the better); 
  # for concepts and evidence, the strength is the publication's position in the list of all returned publications (smaller the better)
  strength = models.IntegerField(default=0)

  objects = AssociationManager()

