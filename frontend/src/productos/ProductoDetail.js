import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams} from 'react-router-dom';
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

function ProductoDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [proveedor, setProveedor] = useState(null);
    const [proveedores, setProveedores] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        axios.get(`/api/producto/${id}/`)
            .then(response => {
                setProducto(response.data);
                return axios.get(`/api/proveedor/${response.data.proveedor}/`);
            })
            .then(response => {
                setProveedor(response.data);
            })
            .catch(error => {
                console.error('Hubo un error consultando el producto o proveedor', error);
            });

        axios.get('/api/proveedor/')
            .then(response => {
                setProveedores(response.data);
            })
            .catch(error => {
                console.error('Hubo un error consultando los proveedores', error);
            });
    }, [id]);

    const handleDelete = () => {
        const csrfToken = getCSRFToken();
        axios.delete(`/api/producto/${id}/`, {
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(() => {
                setMensaje('Producto borrado exitosamente');
                navigate('/productos');
            })
            .catch(error => {
                setMensaje('Hubo un error borrando el producto');
                console.error('Hubo un error borrando el producto', error);
            });
    };

    const handleEdit = (event) => {
        event.preventDefault();
        const csrfToken = getCSRFToken();
        axios.put(`/api/producto/${id}/`, producto, {
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(() => {
                setMensaje('Producto actualizado exitosamente');
                return axios.get(`/api/proveedor/${producto.proveedor}/`);
            })
            .then(response => {
                setProveedor(response.data);
                setEditMode(false);
            })
            .catch(error => {
                setMensaje('Hubo un error actualizando el producto');
                console.error('Hubo un error actualizando el producto', error);
            });
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setProducto({...producto, [name]: value});
    };

    if (!producto || !proveedor) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1>Detalles del Producto</h1>
            <Link to="/productos">
                <button>Regresar a la lista de productos</button>
            </Link>
            <Link to="/registrar-producto">
                <button className="btn btn-primary">Añadir otro producto</button>
            </Link>
            {editMode ? (
                <form onSubmit={handleEdit}>
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
                            {proveedores.map(proveedor => (
                                <option key={proveedor.id} value={proveedor.id}>
                                    {proveedor.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" onClick={() => setEditMode(false)}>Cancelar</button>
                </form>
            ) : (
                <div>
                    <table>
                        <tbody>
                        <tr>
                            <th>ID</th>
                            <td>{producto.id}</td>
                        </tr>
                        <tr>
                            <th>Nombre</th>
                            <td>{producto.nombre}</td>
                        </tr>
                        <tr>
                            <th>Precio</th>
                            <td>{producto.precio}</td>
                        </tr>
                        <tr>
                            <th>Proveedor</th>
                            <td>{proveedor.nombre}</td>
                        </tr>
                        </tbody>
                    </table>
                    <button onClick={() => setEditMode(true)}>Editar Producto</button>
                    <button onClick={handleDelete}>Borrar Producto</button>
                </div>
            )}
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}

export default ProductoDetail;