# Generated by Django 3.0.4 on 2020-04-28 08:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('memes', '0014_auto_20200423_2156'),
    ]

    operations = [
        migrations.AddField(
            model_name='memes',
            name='image_hash',
            field=models.TextField(blank=True, null=True),
        ),
    ]
