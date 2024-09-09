import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../App.css';

// Función para obtener el token CSRF desde las cookies
function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === 'csrftoken=') {
                cookieValue = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return cookieValue;
}

function ProductoEnSolicitudDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productoEnSolicitud, setProductoEnSolicitud] = useState(null);
    const [producto, setProducto] = useState(null);
    const [productos, setProductos] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        axios.get(`/api/producto-en-solicitud/${id}/`)
            .then(response => {
                setProductoEnSolicitud(response.data);
                return axios.get(`/api/producto/${response.data.producto}/`);
            })
            .then(response => {
                setProducto(response.data);
            })
            .catch(error => {
                console.error('Hubo un error consultando el producto en solicitud o el producto', error);
            });

        axios.get('/api/producto/')
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.error('Hubo un error consultando los productos', error);
            });
    }, [id]);

    const handleDelete = () => {
        const csrfToken = getCSRFToken();
        const solicitudId = productoEnSolicitud.solicitud;
        axios.delete(`/api/producto-en-solicitud/${id}/`, {
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(() => {
                setMensaje('Producto en solicitud borrado exitosamente');
                navigate(`/solicitud/${solicitudId}`);
            })
            .catch(error => {
                setMensaje('Hubo un error borrando el producto en solicitud');
                console.error('Hubo un error borrando el producto en solicitud', error);
            });
    };

    const handleEdit = (event) => {
        event.preventDefault();
        const csrfToken = getCSRFToken();
        axios.put(`/api/producto-en-solicitud/${id}/`, productoEnSolicitud, {
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(() => {
                setMensaje('Producto en solicitud actualizado exitosamente');
                setEditMode(false);
                // Actualizar el producto después de la edición
                return axios.get(`/api/producto/${productoEnSolicitud.producto}/`);
            })
            .then(response => {
                setProducto(response.data);
            })
            .catch(error => {
                setMensaje('Hubo un error actualizando el producto en solicitud');
                console.error('Hubo un error actualizando el producto en solicitud', error);
            });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductoEnSolicitud({ ...productoEnSolicitud, [name]: value });
    };

    if (!productoEnSolicitud || !producto) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1>Detalle del Producto en Solicitud {productoEnSolicitud.id}</h1>
            {editMode ? (
                <form onSubmit={handleEdit}>
                    <div>
                        <label>Producto:</label>
                        <select
                            name="producto"
                            value={productoEnSolicitud.producto}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un producto</option>
                            {productos.map(prod => (
                                <option key={prod.id} value={prod.id}>
                                    {prod.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            name="cantidad"
                            value={productoEnSolicitud.cantidad}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" onClick={() => setEditMode(false)}>Cancelar</button>
                </form>
            ) : (
                <div>
                    <p>Solicitud: <Link to={`/solicitud/${productoEnSolicitud.solicitud}`}>{productoEnSolicitud.solicitud}</Link></p>
                    <p>Producto: <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link></p>
                    <p>Cantidad: {productoEnSolicitud.cantidad}</p>
                    <button onClick={() => setEditMode(true)}>Editar Producto en Solicitud</button>
                    <button onClick={handleDelete}>Borrar Producto en Solicitud</button>
                </div>
            )}
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}

export default ProductoEnSolicitudDetail;