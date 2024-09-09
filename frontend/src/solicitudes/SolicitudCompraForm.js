import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
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

function SolicitudCompraForm() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [solicitud, setSolicitud] = useState({productos: [{producto_id: '', cantidad: 1}]});
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

    const handleChange = (index, event) => {
        const {name, value} = event.target;
        const newProductos = [...solicitud.productos];
        newProductos[index] = {...newProductos[index], [name]: value};
        setSolicitud({...solicitud, productos: newProductos});
    };

    const handleAddProducto = () => {
        setSolicitud({...solicitud, productos: [...solicitud.productos, {producto_id: '', cantidad: 1}]});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const csrfToken = getCSRFToken();
        axios.post('/api/solicitud/', solicitud, {
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(response => {
                const nuevaSolicitudId = response.data.id;
                setMensaje('Solicitud de compra registrada exitosamente');
                navigate(`/solicitud/${nuevaSolicitudId}`);
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error en la respuesta de la API:', error.response.data);
                    setMensaje(`Error: ${error.response.data.detail || 'Hubo un error creando la solicitud de compra'}`);
                } else if (error.request) {
                    console.error('No se recibió respuesta de la API:', error.request);
                    setMensaje('Error: No se recibió respuesta del servidor');
                } else {
                    console.error('Error al configurar la solicitud:', error.message);
                    setMensaje(`Error: ${error.message}`);
                }
            });
    };

    return (
        <div>
            <h1>Registrar Nueva Solicitud de Compra</h1>
            <form onSubmit={handleSubmit}>
                {solicitud.productos.map((producto, index) => (
                    <div key={index}>
                        <label>Producto:</label>
                        <select
                            name="producto_id"
                            value={producto.producto_id}
                            onChange={(event) => handleChange(index, event)}
                            required
                        >
                            <option value="">Seleccione un producto</option>
                            {productos.map(prod => (
                                <option key={prod.id} value={prod.id}>
                                    {prod.nombre}
                                </option>
                            ))}
                        </select>
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            name="cantidad"
                            value={producto.cantidad}
                            onChange={(event) => handleChange(index, event)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={handleAddProducto}>Agregar Producto</button>
                <button type="submit">Registrar</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}

export default SolicitudCompraForm;