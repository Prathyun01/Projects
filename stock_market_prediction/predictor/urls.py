from django.urls import path
from .views import stock_prediction_view

urlpatterns = [
    path('', stock_prediction_view, name='stock_prediction'),
]
