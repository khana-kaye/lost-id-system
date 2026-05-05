from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='officer',
            name='badge_id',
            field=models.CharField(blank=True, max_length=50, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='officer',
            name='rank',
            field=models.CharField(blank=True, default='Officer', max_length=50),
        ),
        migrations.AddField(
            model_name='officer',
            name='station',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
