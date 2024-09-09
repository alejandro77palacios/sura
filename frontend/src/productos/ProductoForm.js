import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

function ProductoForm() {
    const navigate = useNavigate();
    const [producto, setProducto] = useState({ nombre: '', precio: '', proveedor: '' });
    const [proveedores, setProveedores] = useState([]);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        axios.get('/api/proveedor/')
            .then(response => {
                setProveedores(response.data);
            })
            .catch(error => {
                console.error('Hubo un error consultando los proveedores', error);
            });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const csrfToken = getCSRFToken();
        axios.post('/api/producto/', producto, {
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(response => {
                const nuevoProductoId = response.data.id;
                setMensaje('Producto registrado exitosamente');
                navigate(`/producto/${nuevoProductoId}`);
            })
            .catch(error => {
                setMensaje('Hubo un error registrando el producto');
                console.error('Hubo un error registrando el producto', error);
            });
    };

    return (
        <div>
            <h2>Registrar Nuevo Producto</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={producto.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        value={producto.precio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Proveedor:</label>
                    <select
                        name="proveedor"
                        value={producto.proveedor}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un proveedor</option>
                        {proveedores.map(proveedor => (
                            <option key={proveedor.id} value={proveedor.id}>
                                {proveedor.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Registrar</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}

export default ProductoForm;