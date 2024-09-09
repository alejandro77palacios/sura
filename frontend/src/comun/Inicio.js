import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Inicio() {
  return (
    <div>
      <h1>Bienvenido</h1>
      <nav>
        <ul>
          <li><Link to="/proveedores">Proveedores</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/solicitudes">Solicitudes de Compra</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Inicio;