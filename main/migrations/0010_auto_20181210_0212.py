# Generated by Django 2.1.4 on 2018-12-10 02:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_auto_20181209_2130'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sentiment',
            old_name='times',
            new_name='time',
        ),
    ]
