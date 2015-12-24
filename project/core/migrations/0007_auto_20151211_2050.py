# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_evidencetopic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='association',
            name='sourceId',
            field=models.CharField(max_length=16),
        ),
        migrations.AlterField(
            model_name='association',
            name='targetId',
            field=models.CharField(max_length=16),
        ),
    ]
