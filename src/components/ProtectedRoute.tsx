import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {ReactNode} from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const {user} = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;