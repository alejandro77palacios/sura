import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function SolicitudCompraList() {
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        axios.get('/api/solicitud/')
            .then(response => {
                setSolicitudes(response.data);
            })
            .catch(error => {
                console.error('Hubo un error consultando las solicitudes de compra', error);
            });
    }, []);

    return (
        <div>
            <h1>Solicitudes de Compra</h1>
            <Link to="/registrar-solicitud">
                <button className="btn btn-primary">Añadir Solicitud</button>
            </Link>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudes.map(solicitud => (
                        <tr key={solicitud.id}>
                            <td><Link to={`/solicitud/${solicitud.id}`}>{solicitud.id}</Link></td>
                            <td>{solicitud.fecha}</td>
                            <td>{solicitud.total}</td>
                            <td>{solicitud.aprobada ? 'Aprobada' : 'Pendiente'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SolicitudCompraList;