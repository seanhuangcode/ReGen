from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path('take_image/', views.take_image, name='take_image'),
    path('choice/', views.choice, name='choice'),
    path('gen_from_img/', views.gen_from_img, name='gen_from_img'), 
    path('text_response', views.text_response, name='text_response'), 
]