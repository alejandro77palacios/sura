import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../App.css';

function SolicitudCompraDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [solicitud, setSolicitud] = useState(null);
    const [productosEnSolicitud, setProductosEnSolicitud] = useState([]);

    useEffect(() => {
        axios.get(`/api/solicitud/${id}/`)
            .then(response => {
                setSolicitud(response.data);
            })
            .catch(error => {
                console.error('Hubo un error consultando la solicitud de compra', error);
            });

        axios.get('/api/producto-en-solicitud/')
            .then(response => {
                const productosFiltrados = response.data.filter(producto => producto.solicitud === parseInt(id));
                const productosPromises = productosFiltrados.map(productoEnSolicitud =>
                    axios.get(`/api/producto/${productoEnSolicitud.producto}/`)
                        .then(response => ({
                            ...productoEnSolicitud,
                            producto: response.data
                        }))
                );
                return Promise.all(productosPromises);
            })
            .then(productosConDetalles => {
                setProductosEnSolicitud(productosConDetalles);
            })
            .catch(error => {
                console.error('Hubo un error consultando los productos en solicitud', error);
            });
    }, [id]);

    const toggleAprobada = () => {
        const updatedSolicitud = { ...solicitud, aprobada: !solicitud.aprobada };
        axios.put(`/api/solicitud/${id}/`, updatedSolicitud)
            .then(response => {
                setSolicitud(response.data);
            })
            .catch(error => {
                console.error('Hubo un error actualizando el estado de la solicitud', error);
            });
    };

    const handleAddProductoEnSolicitud = () => {
        navigate(`/registrar-producto-en-solicitud?solicitud=${id}`);
    };

    if (!solicitud) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <Link to="/solicitudes">
                <button>Regresar a la lista de Solicitudes</button>
            </Link>
            <Link to="/registrar-solicitud">
                <button className="btn btn-primary">Añadir otra solicitud</button>
            </Link>
            <h1>Solicitud de compra {solicitud.id}</h1>
            <p>Fecha de creación: {solicitud.fecha}</p>
            <p>Total: {solicitud.total}</p>
            <p>Estado: {solicitud.aprobada ? 'Aprobada' : 'Pendiente'}</p>
            <button onClick={toggleAprobada}>
                {solicitud.aprobada ? 'Poner en Pendiente' : 'Aprobar'}
            </button>
            <h2>Productos en la solicitud</h2>
            <button onClick={handleAddProductoEnSolicitud}>Agregar producto a la solicitud</button>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {productosEnSolicitud.map((productoEnSolicitud) => (
                        <tr key={productoEnSolicitud.id}>
                            <td>
                                <Link to={`/producto/${productoEnSolicitud.producto.id}`}>
                                    {productoEnSolicitud.producto.nombre}
                                </Link>
                            </td>
                            <td>{productoEnSolicitud.producto.precio}</td>
                            <td>{productoEnSolicitud.cantidad}</td>
                            <td>{(productoEnSolicitud.producto.precio * productoEnSolicitud.cantidad).toFixed(2)}</td>
                            <td>
                                <Link to={`/producto-en-solicitud/${productoEnSolicitud.id}`}>
                                    Editar
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SolicitudCompraDetail;