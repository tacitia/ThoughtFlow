# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20151101_2215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='evidencebookmark',
            name='evidence_id',
            field=models.ForeignKey(to='core.Evidence'),
        ),
    ]
