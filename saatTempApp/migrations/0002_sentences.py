# Generated by Django 2.2 on 2020-02-22 12:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('saatTempApp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Sentences',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sentence', models.CharField(max_length=8000)),
                ('sentence_id', models.IntegerField(null=True)),
                ('txt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='saatTempApp.Text_files')),
            ],
        ),
    ]
