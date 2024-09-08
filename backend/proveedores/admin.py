from django.contrib import admin

from proveedores.models import Proveedor, Producto, ProductoEnSolicitud, SolicitudCompra


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "direccion", "telefono", "correo")


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "formatear_precio", "proveedor")
    search_fields = ("nombre", "precio")
    list_filter = ("proveedor",)

    def formatear_precio(self, obj):
        return f"${obj.precio:,.2f}"

    formatear_precio.short_description = "PRECIO"


class ProductoEnSolicitudInline(admin.TabularInline):
    model = ProductoEnSolicitud
    extra = 0
    fields = ('producto', 'cantidad')


@admin.register(SolicitudCompra)
class SolicitudCompraAdmin(admin.ModelAdmin):
    list_display = ("id", "formatear_fecha", "formatear_total", "aprobada")
    inlines = [ProductoEnSolicitudInline]
    fields = ("aprobada",)

    def formatear_total(self, obj):
        return f"${obj.total:,.2f}"

    formatear_total.short_description = "TOTAL"

    def formatear_fecha(self, obj):
        return obj.fecha.strftime("%d %b %Y")

    formatear_fecha.short_description = "FECHA"
