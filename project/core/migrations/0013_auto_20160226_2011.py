# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-26 20:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_citations'),
    ]

    operations = [
        migrations.CreateModel(
            name='Citation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paper_id', models.IntegerField()),
                ('citation_id', models.IntegerField()),
                ('collection_id', models.IntegerField()),
            ],
        ),
        migrations.DeleteModel(
            name='Citations',
        ),
    ]
