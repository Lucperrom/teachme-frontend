import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import NavigationBar from "./components/NavigationBar.tsx";
import SignUp from "./pages/SignUp.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";
import {AppRoute} from "./constants/routes.ts";

function App() {
    return (
        <>
            <NavigationBar/>
            <Routes>
                <Route index path={AppRoute.HOME} element={<Home/>}/>
                <Route path={AppRoute.LOGIN} element={<Login/>}/>
                <Route path={AppRoute.SIGNUP} element={<SignUp/>}/>
                <Route path={AppRoute.PROFILE}
                       element={
                           <ProtectedRoute>
                               <Profile/>
                           </ProtectedRoute>
                       }
                />
                <Route path={AppRoute.NOT_FOUND} element={<NotFound/>}/>
            </Routes>
        </>
    )
}

export default App
