# Generated by Django 3.0.5 on 2020-04-15 16:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('memes', '0011_memes_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='memes',
            name='fileName_compressed',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='memes',
            name='url_compressed',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
