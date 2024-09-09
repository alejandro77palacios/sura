import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import checkToken from './checkToken';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Route
      {...rest}
      render={async (props) => {
        const isTokenValid = await checkToken();
        return isTokenValid ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    />
  );
};

export default PrivateRoute;