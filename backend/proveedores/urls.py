from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'proveedor', views.ProveedorView)
router.register(r'producto', views.ProductoView)
router.register(r'solicitud', views.SolicitudCompraViewSet)
router.register(r'producto-en-solicitud', views.ProductoEnSolicitudViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
