# Generated by Django 4.2.4 on 2023-11-12 08:18

import ckeditor.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0009_remove_social_threads'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='categoryinfo',
            field=models.TextField(blank=True, verbose_name='Category Description'),
        ),
        migrations.AddField(
            model_name='category',
            name='content',
            field=ckeditor.fields.RichTextField(blank=True, verbose_name='Product Content'),
        ),
    ]