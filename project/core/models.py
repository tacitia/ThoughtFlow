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
    return str(self.id) + ' ' + self.term


class EvidenceManager(models.Manager):
    def create_evidence(self, title, abstract, metadata, created_by, augmentation):
      evidence, created = self.get_or_create(title=title, abstract=abstract, metadata=metadata, created_by=created_by, augmentation=augmentation)
      return evidence

class Evidence(models.Model):
  title = models.CharField(max_length=512) 
  abstract = models.TextField()
  metadata = models.TextField()
  # evidence retrieved by ThoughtFlow remains to be "created_by=0" until has been selected or annotated by the user
  created_by = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  # user provided evidence have augmentation of 0; 1st level related articles have augmentation 1, and so forth
  augmentation = models.IntegerField(default=0)

  objects = EvidenceManager()

  def __unicode__(self):
    return str(self.id) + ' ' + self.title


class AssociationManager(models.Manager):
  def create_association(self, sourceType, targetType, sourceId, targetId, created_by):
    association, created = self.get_or_create(sourceType=sourceType, targetType=targetType, sourceId=sourceId, targetId=targetId, created_by=created_by)
    return association, created

  def update_association(self, associationId, sourceId, targetId):
    association = self.get(id=associationId)
    association.sourceId = sourceId
    association.targetId = targetId
    association.save()
    return association

  def delete_association(self, sourceType, targetType, sourceId, targetId, created_by):
    self.filter(sourceType=sourceType, targetType=targetType, sourceId=sourceId, targetId=targetId, created_by=created_by).delete()

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
  sourceId = models.CharField(max_length=16)
  targetId = models.CharField(max_length=16)
  created_by = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  # How strong the association is; if the association is added by the user, the strength is 0, which actually means the strongest
  # association; for concepts and concepts, the strength is the # of co-occurrences divided by the total # of publications seen 
  # (larger the better); 
  # for concepts and evidence, the strength is the publication's position in the list of all returned publications (smaller the better)
  strength = models.IntegerField(default=0)

  objects = AssociationManager()

class EvidenceBookmarkManager(models.Manager):
  def create_entry(self, evidence_id, user_id):
    entry, created = self.get_or_create(evidence_id=evidence_id, user_id=user_id)
    return entry

class EvidenceBookmark(models.Model):
  evidence = models.ForeignKey(Evidence)
  user_id = models.IntegerField()

  objects = EvidenceBookmarkManager()

class EvidenceTopicManager(models.Manager):
  def create_entry(self, evidence_id, primary_topic, primary_topic_prob, topic_dist, created_by):
    entry, created = self.get_or_create(evidence_id=evidence_id, primary_topic=primary_topic, primary_topic_prob=primary_topic_prob, topic_dist=topic_dist, created_by=created_by)
    return entry

class EvidenceTopic(models.Model):
  evidence = models.ForeignKey(Evidence)
  primary_topic = models.IntegerField()
  primary_topic_prob = models.FloatField()
  topic_dist = models.TextField()
  created_by = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  objects = EvidenceTopicManager()

class Topic(models.Model):
  collection_id = models.IntegerField()
  index = models.IntegerField()
  terms = models.TextField()
  document_count = models.IntegerField()

class Collection(models.Model):
  collection_id = models.IntegerField()
  collection_name = models.CharField(max_length=128)
  description = models.TextField(default='')
  num_pubs = models.IntegerField(default=0)

class Citation(models.Model):
  paper_id = models.IntegerField()
  citation_id = models.IntegerField()
  collection_id = models.IntegerField()
