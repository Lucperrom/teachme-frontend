import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {ReactNode} from "react";
import {AppRoute} from "../constants/routes.ts";
import LoadingSpinner from "./LoadingSpinner.tsx";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const {user, isLoading, profileCompleted} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    if (!user) {
        return <Navigate to={AppRoute.LOGIN} state={{from: location}} replace/>;
    }

    if (!profileCompleted) {
        if (location.pathname === AppRoute.COMPLETE_PROFILE) {
            return <>{children}</>;
        }
        return <Navigate to={AppRoute.COMPLETE_PROFILE} state={{from: location}} replace/>;
    }

    if (location.pathname === AppRoute.COMPLETE_PROFILE) {
        return <Navigate to={AppRoute.HOME} state={{from: location}} replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;