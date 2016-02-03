# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_auto_20151211_2050'),
    ]

    operations = [
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('collection_id', models.IntegerField()),
                ('index', models.IntegerField()),
                ('terms', models.TextField()),
                ('document_count', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
