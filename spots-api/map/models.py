from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Spot(models.Model):

    name = models.CharField(max_length=50)
    description = models.CharField(max_length=500)
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        spot = "Spot %s - %s: %s" % (self.id, self.name, self.description)
        return spot

    def get_score(self):
        votes = Vote.objects.filter(spot=self.id)

        score = 0
        for vote in votes:
            score += 1 if vote.positive else -1

        return score

    def get_ratings_dict(self):
        ratings = Rating.objects.filter(spot=self.id)

        ratings_dict = {}
        for rating in ratings:
            if rating.rating_type.name in ratings_dict:
                ratings_dict[rating.rating_type.name] += rating.score
            else:
                ratings_dict[rating.rating_type.name] = rating.score

        for rating_type, score in ratings_dict.items():
            ratings_dict[rating_type] = round((score / ratings.count()), 2)

        return ratings_dict

class RatingType(models.Model):

    name = models.CharField(max_length=50)

    def __str__(self):
        rating_type = self.name
        return rating_type

class Rating(models.Model):

    spot = models.ForeignKey(Spot, on_delete=models.CASCADE)
    rating_type = models.ForeignKey(RatingType, on_delete=models.CASCADE)
    score = models.IntegerField(
        validators=[
            MaxValueValidator(10),
            MinValueValidator(1)
        ]
    )

class Vote(models.Model):

    spot = models.ForeignKey(Spot, on_delete=models.CASCADE)
    positive = models.BooleanField()
