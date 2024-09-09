import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const LoginUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password,
            });
            const {access, refresh} = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);

            const userResponse = await axios.get('http://localhost:8000/api/user/', {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });
            const {rol} = userResponse.data;
            localStorage.setItem('role', rol);

            navigate('/');
        } catch (error) {
            setError('Error al iniciar sesión');
            console.error('Error al iniciar sesión:', error);
        }
    };

    return (
        <div>
            <h2>Iniciar sesión</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre de usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginUser;