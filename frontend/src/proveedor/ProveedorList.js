import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function ProveedorList() {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    axios.get('/api/proveedor/')
      .then(response => {
        setProveedores(response.data);
      })
      .catch(error => {
        console.error('Hubo un error consultando los proveedores', error);
      });
  }, []);

  return (
    <div>
      <h1>Proveedores</h1>
        <Link to="/registrar-proveedor">
            <button className="btn btn-primary">Añadir Proveedor</button>
        </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(proveedor => (
            <tr key={proveedor.id}>
              <td>{proveedor.id}</td>
              <td><Link to={`/proveedor/${proveedor.id}`}>{proveedor.nombre}</Link></td>
              <td>{proveedor.direccion}</td>
              <td>{proveedor.telefono}</td>
              <td>{proveedor.correo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProveedorList;