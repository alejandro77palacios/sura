from django.contrib.auth import get_user_model
from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Proveedor, Producto, SolicitudCompra, ProductoEnSolicitud
from .serializers import (
    ProveedorSerializer,
    ProductoSerializer,
    SolicitudCompraSerializer,
    ProductoEnSolicitudSerializer,
    UserSerializer,
)


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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class UserCreate(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class UserDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
