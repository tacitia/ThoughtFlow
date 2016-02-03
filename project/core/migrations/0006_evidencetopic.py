# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20151103_2032'),
    ]

    operations = [
        migrations.CreateModel(
            name='EvidenceTopic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('primary_topic', models.IntegerField()),
                ('primary_topic_prob', models.FloatField()),
                ('topic_dist', models.TextField()),
                ('created_by', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('evidence', models.ForeignKey(to='core.Evidence')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
