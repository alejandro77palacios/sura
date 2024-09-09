import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Inicio() {
  return (
    <div>
      <h1>Bienvenido(a) al Portal de Proveedores</h1>
      <p>Utiliza las siguientes opciones para navegar por la aplicación:</p>
      <div className="inicio-sections">
        <div className="inicio-section">
          <h2><Link to="/registrar-usuario">Crear usuarios</Link></h2>
        </div>
        <div className="inicio-section">
          <h2><Link to="/proveedores">Proveedores</Link></h2>
        </div>
        <div className="inicio-section">
          <h2><Link to="/productos">Productos</Link></h2>
        </div>
        <div className="inicio-section">
          <h2><Link to="/solicitudes">Solicitudes de Compra</Link></h2>
        </div>
      </div>
    </div>
  );
}

export default Inicio;