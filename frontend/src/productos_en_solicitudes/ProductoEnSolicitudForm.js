import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
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

function ProductoEnSolicitudForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const solicitudId = queryParams.get('solicitud');

    const [productoEnSolicitud, setProductoEnSolicitud] = useState({ solicitud: solicitudId || '', producto: '', cantidad: '' });
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        axios.get('/api/producto/')
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.error('Hubo un error consultando los productos', error);
            });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductoEnSolicitud({ ...productoEnSolicitud, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const csrfToken = getCSRFToken();
        axios.post('/api/producto-en-solicitud/', productoEnSolicitud, {
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(() => {
                setMensaje('Producto en solicitud registrado exitosamente');
                navigate('/solicitudes');
            })
            .catch(error => {
                setMensaje('Hubo un error registrando el producto en solicitud');
                console.error('Hubo un error registrando el producto en solicitud', error);
            });
    };

    return (
        <div>
            <h1>Registrar Producto en Solicitud</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Solicitud:</label>
                    <input
                        type="text"
                        name="solicitud"
                        value={productoEnSolicitud.solicitud}
                        onChange={handleChange}
                        readOnly
                    />
                </div>
                <div>
                    <label>Producto:</label>
                    <select
                        name="producto"
                        value={productoEnSolicitud.producto}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un producto</option>
                        {productos.map(producto => (
                            <option key={producto.id} value={producto.id}>
                                {producto.nombre}
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
                <button type="submit">Registrar</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}

export default ProductoEnSolicitudForm;