# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20151103_0111'),
    ]

    operations = [
        migrations.RenameField(
            model_name='evidencebookmark',
            old_name='evidence_id',
            new_name='evidence',
        ),
    ]
