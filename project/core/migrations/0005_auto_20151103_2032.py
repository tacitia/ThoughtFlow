# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_auto_20151103_0248'),
    ]

    operations = [
        migrations.AlterField(
            model_name='evidence',
            name='title',
            field=models.CharField(max_length=512),
        ),
    ]
