# Sura | Portal de Proveedores

## Descripción

Este proyecto es un portal de gestión de proveedores, productos y solicitudes de compra. Permite a los usuarios
registrar y gestionar proveedores, productos y solicitudes de compra, así como crear y gestionar usuarios con diferentes
roles.

## Requisitos

- Python 3.8+
- Node.js 14+
- npm 6+

## Instalación

### Backend

1. Clone el repositorio:
    ```bash
    git clone https://github.com/alejandro77palacios/sura.git
    cd sura/backend
    ```

2. Cree y active un entorno virtual:
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
    ```

3. Instale las dependencias:
    ```bash
    pip install -r requirements.txt
    ```

4. Realice las migraciones de la base de datos:
    ```bash
    python manage.py migrate
    ```

5. Inicie el servidor de desarrollo:
    ```bash
    python manage.py runserver
    ```
   Por defecto se utilizará el puerto 8000.

### Frontend

1. Navegue al directorio del frontend:
    ```bash
    cd ../frontend
    ```

2. Instale las dependencias:
    ```bash
    npm install
    ```

3. Inicie el servidor de desarrollo:
    ```bash
    npm start
    ```
   Por defecto se utilizará el puerto 3000.

## Uso

### Funcionalidades del Usuario

- **Crear Usuarios**: Los usuarios pueden registrarse con diferentes roles (`colocador` y `aprobador`).
- **Gestionar Proveedores**: Los usuarios pueden agregar, editar y eliminar proveedores.
- **Gestionar Productos**: Los usuarios pueden agregar, editar y eliminar productos asociados a proveedores.
- **Gestionar Solicitudes de Compra**: Los usuarios pueden crear, ver y aprobar solicitudes de compra.

### API

La API fue creada utilizando Django y Django REST Framework. A continuación se describen los principales endpoints:

- **Usuarios**:
    - `POST /api/register/`: Registrar un nuevo usuario.
    - `POST /api/token/`: Obtener un token JWT.
    - `POST /api/token/refresh/`: Refrescar el token JWT.

- **Proveedores**:
    - `GET /api/proveedor/`: Listar todos los proveedores.
    - `POST /api/proveedor/`: Crear un nuevo proveedor.
    - `GET /api/proveedor/{id}/`: Obtener detalles de un proveedor.
    - `PUT /api/proveedor/{id}/`: Actualizar un proveedor.
    - `DELETE /api/proveedor/{id}/`: Eliminar un proveedor.

- **Productos**:
    - `GET /api/producto/`: Listar todos los productos.
    - `POST /api/producto/`: Crear un nuevo producto.
    - `GET /api/producto/{id}/`: Obtener detalles de un producto.
    - `PUT /api/producto/{id}/`: Actualizar un producto.
    - `DELETE /api/producto/{id}/`: Eliminar un producto.

- **Solicitudes de Compra**:
    - `GET /api/solicitud/`: Listar todas las solicitudes de compra.
    - `POST /api/solicitud/`: Crear una nueva solicitud de compra.
    - `GET /api/solicitud/{id}/`: Obtener detalles de una solicitud de compra.
    - `PUT /api/solicitud/{id}/`: Actualizar una solicitud de compra.
    - `DELETE /api/solicitud/{id}/`: Eliminar una solicitud de compra.

## Aclaraciones

Como científico de datos y desarrollador de software, utilizo Django en mi día a día en mi trabajo para recopilar datos,
presentar información, automatizar procesos y desplegar modelos de aprendizaje automático.
Sin embargo, no soy un desarrollador frontend, hace tiempo tuve un pequeño contacto con React y usé lo que sabía, espero
que el código no sea tan repetitivo y que el diseño sea suficiente.

Cuando he manejado usuarios y roles lo he hecho a través de las herramientas de Django, no de las de Django Rest
Framework,
por lo que no estoy satisfecho con el resultado de los procesos de autenticación y autorización.
En el servidor del backend se puede acceder a Django Admin para gestionar los datos, además, la API es accesible a
través de
la URL /api/, donde se puede interactuar con los objetos de la base de datos.

Finalmente, procuré mantener todo en español, pero existen ciertos patrones comunes de diseño en inglés que son demasiado  
comunes y preferí mantenerlos en tal idioma. 
