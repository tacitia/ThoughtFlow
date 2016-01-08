# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logger', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='action',
            old_name='version',
            new_name='version_major',
        ),
        migrations.AddField(
            model_name='action',
            name='version_minor',
            field=models.CharField(default='v2', max_length=8),
            preserve_default=False,
        ),
    ]
