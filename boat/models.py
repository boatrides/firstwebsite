from django.db import models

# Create your models here.
class slider(models.Model):
    images=models.ImageField(upload_to="../static/images/slider")
    title=models.CharField(max_length=200)
    tagline=models.CharField(max_length=200)

    def __str__(self):
        return self.title

class boats(models.Model):
    boat_type=models.CharField(max_length=20)
    boat_image=models.ImageField(upload_to="../static/images/boats")
    line_1=models.CharField(max_length=200)
    line_2=models.CharField(max_length=200)
    line_3=models.CharField(max_length=200)
    line_4=models.CharField(max_length=200)

    def __str__(self):
        return self.boat_type

class testimonial(models.Model):
    name=models.CharField(max_length=20)
    place=models.CharField(max_length=100)
    review=models.TextField()
    photo=models.ImageField(upload_to="../static/images/testimonial")

    def __str__(self):
        return self.name
