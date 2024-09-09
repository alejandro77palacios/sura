from rest_framework import viewsets

from .models import Proveedor, Producto, SolicitudCompra, ProductoEnSolicitud
from .serializers import ProveedorSerializer, ProductoSerializer, SolicitudCompraSerializer, \
    ProductoEnSolicitudSerializer


class ProveedorView(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer


class ProductoView(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class ProductoEnSolicitudViewSet(viewsets.ModelViewSet):
    queryset = ProductoEnSolicitud.objects.all()
    serializer_class = ProductoEnSolicitudSerializer


class SolicitudCompraViewSet(viewsets.ModelViewSet):
    queryset = SolicitudCompra.objects.all()
    serializer_class = SolicitudCompraSerializer
