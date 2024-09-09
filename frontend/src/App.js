import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Inicio from './comun/Inicio';
import ProveedorList from './proveedor/ProveedorList';
import ProveedorDetail from './proveedor/ProveedorDetail';
import ProductoList from './productos/ProductoList';
import ProductoDetail from './productos/ProductoDetail';
import ProveedorForm from './proveedor/ProveedorForm';
import ProductoForm from './productos/ProductoForm';
import ProductoEnSolicitudDetail from './productos_en_solicitudes/ProductoEnSolicitudDetail';
import ProductoEnSolicitudForm from './productos_en_solicitudes/ProductoEnSolicitudForm';
import SolicitudCompraForm from './solicitudes/SolicitudCompraForm';
import SolicitudCompraList from './solicitudes/SolicitudCompraList';
import SolicitudCompraDetail from './solicitudes/SolicitudCompraDetail';
import BotonInicio from './comun/BotonInicio';
import RegisterUser from './RegisterUser';
import LoginUser from './LoginUser';
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <BotonInicio/>
                <Routes>
                    <Route exact path="/" element={<Inicio/>}/>
                    <Route path="/proveedores" element={<ProveedorList/>}/>
                    <Route path="/proveedor/:id" element={<ProveedorDetail/>}/>
                    <Route path="/registrar-proveedor" element={<ProveedorForm/>}/>

                    <Route path="/productos" element={<ProductoList/>}/>
                    <Route path="/producto/:id" element={<ProductoDetail/>}/>
                    <Route path="/registrar-producto" element={<ProductoForm/>}/>

                    <Route path="/producto-en-solicitud/:id" element={<ProductoEnSolicitudDetail/>}/>
                    <Route path="/registrar-producto-en-solicitud" element={<ProductoEnSolicitudForm/>}/>

                    <Route path="/solicitudes" element={<SolicitudCompraList/>}/>
                    <Route path="/solicitud/:id" element={<SolicitudCompraDetail/>}/>
                    <Route path="/registrar-solicitud" element={<SolicitudCompraForm/>}/>

                    <Route path="/registrar-usuario" element={<RegisterUser/>}/>
                    <Route path="/login" element={<LoginUser/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;