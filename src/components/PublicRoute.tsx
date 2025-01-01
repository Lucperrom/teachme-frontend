import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../services/auth/AuthContext.tsx';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({children}) => {
    const {user} = useAuth();

    if (user) {
        return <Navigate to="/home" replace/>;
    }

    return <>{children}</>;
};

export default PublicRoute;
