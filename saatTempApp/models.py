from django.db import models

# Create your models here.
class Text_files(models.Model):
    txt = models.FileField()
    txt_name = models.CharField(max_length=200, null=True)
    txt_title = models.CharField(max_length=250, null=True)
    downloaded = models.BooleanField(default=False)
    is_processed = models.BooleanField(default=False)
    is_lemma_extracted = models.BooleanField(default=False)

    def __str__(self):
        return self.txt_name+ " - " + str(self.id)

class Sentences(models.Model):
    txt = models.ForeignKey(Text_files, on_delete=models.CASCADE)
    sentence = models.CharField(max_length=8000)
    sentence_id = models.IntegerField(null=True)

    def __str__(self):
        return str(self.sentence_id) + " - " + self.sentence

class Section(models.Model):

    txt = models.ForeignKey(Text_files, on_delete=models.CASCADE,null=True)
    text = models.TextField(blank=True, null=True)
    section_number = models.CharField(max_length=50, null=True)
    is_heading = models.BooleanField(default=False)

    def __str__(self):
        return self.text
