# Generated by Django 2.0 on 2018-01-15 19:32

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0002_auto_20171231_0021'),
    ]

    operations = [
        migrations.AddField(
            model_name='spot',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='spot',
            name='updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
