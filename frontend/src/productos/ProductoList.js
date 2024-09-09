import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import '../App.css';

function ProductoList() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        axios.get('/api/producto/')
            .then(response => {
                const productos = response.data;
                const proveedorPromises = productos.map(producto =>
                    axios.get(`/api/proveedor/${producto.proveedor}/`)
                        .then(response => {
                            producto.proveedor = response.data;
                            return producto;
                        })
                );
                return Promise.all(proveedorPromises);
            })
            .then(productosConProveedores => {
                setProductos(productosConProveedores);
            })
            .catch(error => {
                console.error('Hubo un error consultando los productos o proveedores', error);
            });
    }, []);

    return (
        <div>
            <h1>Productos</h1>
            <Link to="/registrar-producto">
                <button className="btn btn-primary">Añadir Producto</button>
            </Link>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Proveedor</th>
                </tr>
                </thead>
                <tbody>
                {productos.map(producto => (
                    <tr key={producto.id}>
                        <td>{producto.id}</td>
                        <td><Link to={`/producto/${producto.id}`}>{producto.nombre}</Link></td>
                        <td>{producto.precio}</td>
                        <td><Link to={`/proveedor/${producto.proveedor.id}`}>{producto.proveedor.nombre}</Link></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductoList;