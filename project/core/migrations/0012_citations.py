# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-26 03:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_auto_20160203_0430'),
    ]

    operations = [
        migrations.CreateModel(
            name='Citations',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paper_id', models.IntegerField()),
                ('citation_id', models.IntegerField()),
            ],
        ),
    ]
