import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function BotonInicio() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate('/')}>Volver a Inicio</button>
  );
}

export default BotonInicio;