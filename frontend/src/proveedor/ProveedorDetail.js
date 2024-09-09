import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams, useNavigate, Link} from 'react-router-dom';
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

function ProveedorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get(`/api/proveedor/${id}/`)
      .then(response => {
        setProveedor(response.data);
      })
      .catch(error => {
        console.error('Hubo un error consultando el proveedor', error);
      });
  }, [id]);

  const handleDelete = () => {
    const csrfToken = getCSRFToken();
    axios.delete(`/api/proveedor/${id}/`, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    })
      .then(() => {
        setMensaje('Proveedor borrado exitosamente');
        navigate('/proveedores');
      })
      .catch(error => {
        setMensaje('Hubo un error borrando el proveedor');
        console.error('Hubo un error borrando el proveedor', error);
      });
  };

  const handleEdit = (event) => {
    event.preventDefault();
    const csrfToken = getCSRFToken();
    axios.put(`/api/proveedor/${id}/`, proveedor, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    })
      .then(() => {
        setMensaje('Proveedor actualizado exitosamente');
        setEditMode(false);
      })
      .catch(error => {
        setMensaje('Hubo un error actualizando el proveedor');
        console.error('Hubo un error actualizando el proveedor', error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProveedor({ ...proveedor, [name]: value });
  };

  if (!proveedor) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Detalles del Proveedor</h1>
      <Link to="/proveedores">
        <button>Regresar a la lista de proveedores</button>
      </Link>
      <Link to="/registrar-proveedor">
        <button className="btn btn-primary">Añadir otro proveedor</button>
      </Link>
      {editMode ? (
        <form onSubmit={handleEdit}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={proveedor.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={proveedor.direccion}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={proveedor.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Correo:</label>
            <input
              type="email"
              name="correo"
              value={proveedor.correo}
              onChange={handleChange}
              required
            />
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
                <td>{proveedor.id}</td>
              </tr>
              <tr>
                <th>Nombre</th>
                <td>{proveedor.nombre}</td>
              </tr>
              <tr>
                <th>Dirección</th>
                <td>{proveedor.direccion}</td>
              </tr>
              <tr>
                <th>Teléfono</th>
                <td>{proveedor.telefono}</td>
              </tr>
              <tr>
                <th>Correo</th>
                <td>{proveedor.correo}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={() => setEditMode(true)}>Editar Proveedor</button>
          <button onClick={handleDelete}>Borrar Proveedor</button>
        </div>
      )}
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default ProveedorDetail;