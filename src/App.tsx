import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import NavigationBar from "./components/NavigationBar.tsx";
import SignUp from "./pages/SignUp.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";
import {AppRoute} from "./constants/routes.ts";
import Landing from "./pages/Landing.tsx";
import PublicRoute from "./components/PublicRoute.tsx";
import CompleteProfile from "./pages/CompleteProfile.tsx";
import Courses from "./pages/Courses.tsx";
import Course from "./pages/Course.tsx";
import {Toaster} from "./components/ui/toaster.tsx";


function App() {
    return (
        <>
            <NavigationBar/>
            <Toaster />

            <Routes>
                <Route index path={AppRoute.LANDING} element={<Landing/>}/>
                <Route path={AppRoute.HOME} element={
                    <ProtectedRoute>
                        <Home/>
                    </ProtectedRoute>
                }/>
                <Route path={AppRoute.LOGIN} element={
                    <PublicRoute>
                        <Login/>
                    </PublicRoute>
                }/>
                <Route path={AppRoute.SIGNUP} element={
                    <PublicRoute>
                        <SignUp/>
                    </PublicRoute>
                }/>
                <Route path={AppRoute.COMPLETE_PROFILE} element={
                    <ProtectedRoute>
                        <CompleteProfile/>
                    </ProtectedRoute>
                }/>
                <Route path={AppRoute.PROFILE}
                       element={
                           <ProtectedRoute>
                               <Profile/>
                           </ProtectedRoute>
                       }
                />
                <Route path={AppRoute.COURSES}
                       element={
                               <Courses/>
                       }
                />
                <Route path={AppRoute.COURSE}
                       element={
                               <Course/>
                       }
                />
                <Route path={AppRoute.NOT_FOUND} element={<NotFound/>}/>
            </Routes>
        </>
    )
}

export default App
