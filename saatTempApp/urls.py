from django.conf.urls import url
from . import views

app_name = 'saatTempApp'

urlpatterns = [
    # url(r'^$', views.index_download, name='index_download'),

    url(r'^$', views.index, name='index'),
]