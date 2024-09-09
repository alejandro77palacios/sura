import React from 'react';
import {Link} from 'react-router-dom';

const BotonInicio = () => {
    return (
        <div>
            <Link to="/">
                <button>Volver a Inicio</button>
            </Link>
            <Link to="/login">
                <button>Iniciar sesión</button>
            </Link>
        </div>
    );
};

export default BotonInicio;