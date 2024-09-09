import React, {useState} from 'react';
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

function ProveedorForm() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const csrfToken = getCSRFToken();
        axios.post('/api/proveedor/', {nombre, direccion, telefono, correo}, {
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(response => {
                const nuevoProveedorId = response.data.id;
                setMensaje('Proveedor registrado exitosamente');
                navigate(`/proveedor/${nuevoProveedorId}`);
            })
            .catch(error => {
                setMensaje('Hubo un error registrando el proveedor');
                console.error('Hubo un error registrando el proveedor', error);
            });
    };

    return (
        <div>
            <h1>Registrar Nuevo Proveedor</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Dirección:</label>
                    <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Correo:</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Registrar</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}

export default ProveedorForm;