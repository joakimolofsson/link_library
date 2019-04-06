import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, handleAuth, ...rest }) => {
    return <Route {...rest} render={props => {
            if(handleAuth()) {
                return <Component {...props} />
            } else {
                return <Redirect to={'/'}/>
            }
        }
    }/>
}

export default ProtectedRoute;