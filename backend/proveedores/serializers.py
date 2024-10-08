from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Proveedor, Producto, SolicitudCompra, ProductoEnSolicitud


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ("id", "nombre", "direccion", "telefono", "correo")


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ("id", "nombre", "precio", "proveedor")


class ProductoEnSolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoEnSolicitud
        fields = ("id", "solicitud", "producto", "cantidad")


class AuxiliarProductoEnSolicitudSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField()
    cantidad = serializers.IntegerField()


class SolicitudCompraSerializer(serializers.ModelSerializer):
    productos = AuxiliarProductoEnSolicitudSerializer(many=True, write_only=True)

    class Meta:
        model = SolicitudCompra
        fields = ["id", "fecha", "total", "aprobada", "productos"]

    def create(self, validated_data):
        productos_data = validated_data.pop("productos")
        user = self.context["request"].user
        try:
            rol = user.rol
        except AttributeError:
            validated_data["aprobada"] = False
        else:
            if rol != "aprobador":
                validated_data["aprobada"] = False
        solicitud = SolicitudCompra.objects.create(**validated_data)
        for producto_data in productos_data:
            producto = Producto.objects.get(pk=producto_data["producto_id"])
            cantidad = producto_data["cantidad"]
            ProductoEnSolicitud.objects.create(solicitud=solicitud, producto=producto, cantidad=cantidad)
        return solicitud


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'rol', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user
