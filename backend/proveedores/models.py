from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Proveedor(models.Model):
    nombre = models.CharField(max_length=50)
    direccion = models.CharField(max_length=100)
    telefono = models.CharField(max_length=10)
    correo = models.EmailField(max_length=30)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'
        ordering = ['nombre']


class Producto(models.Model):
    nombre = models.CharField(max_length=50)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre}, precio ${self.precio:,.2f}"

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['nombre', 'precio']


class SolicitudCompra(models.Model):
    fecha = models.DateField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, editable=False, default=0)
    aprobada = models.BooleanField(default=False)

    def __str__(self):
        estatus = "aprobada" if self.aprobada else "pendiente"
        return f"Solicitud de compra del {self.fecha} por ${self.total:,.2f}, {estatus}"

    class Meta:
        verbose_name = 'Solicitud de compra'
        verbose_name_plural = 'Solicitudes de compra'
        ordering = ['-fecha']


class ProductoEnSolicitud(models.Model):
    solicitud = models.ForeignKey(SolicitudCompra, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.cantidad} {self.producto.nombre} en solicitud {self.solicitud.id}"

    class Meta:
        verbose_name = 'Producto en solicitud'
        verbose_name_plural = 'Productos en solicitud'
        ordering = ['solicitud', 'producto']


@receiver(post_save, sender=ProductoEnSolicitud)
def actualizar_total_solicitud(sender, instance, **kwargs):
    solicitud = instance.solicitud
    solicitud.total = sum(item.producto.precio * item.cantidad for item in solicitud.productoensolicitud_set.all())
    solicitud.save(update_fields=['total'])


class CustomUser(AbstractUser):
    ROLES = (
        ('colocador', 'Colocador'),
        ('aprobador', 'Aprobador'),
    )
    rol = models.CharField(max_length=10, choices=ROLES)
