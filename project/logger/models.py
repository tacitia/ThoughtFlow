from django.db import models

class Action(models.Model):
  user = models.IntegerField()
  name = models.CharField(max_length=64)
  version_major = models.CharField(max_length=8)
  version_minor = models.CharField(max_length=8)
  view = models.CharField(max_length=8)
  created_at = models.DateTimeField(auto_now_add=True)
  parameters = models.TextField()