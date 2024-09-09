import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams} from 'react-router-dom';
import '../App.css';

function SolicitudCompraDetail() {
    const {id} = useParams();
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
                        .then(res => ({...productoEnSolicitud, producto: res.data}))
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
        const updatedSolicitud = {...solicitud, aprobada: !solicitud.aprobada, productos: []};
        axios.put(`/api/solicitud/${id}/`, updatedSolicitud)
            .then(response => {
                setSolicitud(response.data);
            })
            .catch(error => {
                console.error('Hubo un error actualizando el estado de la solicitud', error);
            });
    };

    const deleteSolicitud = () => {
        axios.delete(`/api/solicitud/${id}/`)
            .then(() => {
                navigate('/solicitudes');
            })
            .catch(error => {
                console.error('Hubo un error eliminando la solicitud', error);
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
                Volver a la lista de solicitudes
            </Link>
            <Link to="/registrar-solicitud">
                Registrar nueva solicitud
            </Link>
            <h1>Solicitud de compra {solicitud.id}</h1>
            <p>Fecha de creación: {solicitud.fecha}</p>
            <p>Total: {solicitud.total}</p>
            <p>Estado: {solicitud.aprobada ? 'Aprobada' : 'Pendiente'}</p>
            <button onClick={toggleAprobada}>
                {solicitud.aprobada ? 'Marcar como pendiente' : 'Aprobar solicitud'}
            </button>
            <button onClick={deleteSolicitud} className="btn btn-danger">Eliminar Solicitud</button>
            <h2>Productos en la solicitud</h2>
            <button onClick={handleAddProductoEnSolicitud}>Agregar producto a la solicitud</button>
            <table>
                <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                </tr>
                </thead>
                <tbody>
                {productosEnSolicitud.map(producto => (
                    <tr key={producto.id}>
                        <td>{producto.producto.nombre}</td>
                        <td>{producto.cantidad}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default SolicitudCompraDetail;