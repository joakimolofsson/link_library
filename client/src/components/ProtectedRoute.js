import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, auth, handleAuth, ...rest }) => {
    return <Route {...rest} render={props => {
            if(auth) {
                return <Component {...props} handleAuth={handleAuth}/>
            } else {
                return <Redirect to={'/'}/>
            }
        }
    }/>
}

export default ProtectedRoute;