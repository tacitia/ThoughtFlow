# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-25 00:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_topic'),
    ]

    operations = [
        migrations.AddField(
            model_name='evidence',
            name='augmentation',
            field=models.IntegerField(default=0),
        ),
    ]