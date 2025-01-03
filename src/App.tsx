import { Route, Routes } from "react-router-dom";
import NavigationBar from "./components/NavigationBar.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PublicRoute from "./components/PublicRoute.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { AppRoute } from "./constants/routes.ts";
import CompleteProfile from "./pages/CompleteProfile.tsx";
import Course from "./pages/Course.tsx";
import Courses from "./pages/Courses.tsx";
import Forum from "./pages/Forum.tsx";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import Profile from "./pages/Profile.tsx";
import SignUp from "./pages/SignUp.tsx";
import SwaggerDocs from "./pages/Swagger.tsx";
import RatingList from "./services/rating/RatingList.tsx";

import Notification from "./pages/Notification.tsx";
import Notifications from "./pages/Notifications.tsx";

function App() {
  const isTestMode = import.meta.env.VITE_IS_TEST_MODE === "true";

  return (
    <>
      <NavigationBar />
      <Toaster />

      <Routes>
        <Route index path={AppRoute.LANDING} element={<Landing />} />
        <Route
          path={AppRoute.HOME}
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoute.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={AppRoute.RATING}
          element={
            isTestMode ? (
              <PublicRoute>
                <RatingList />
              </PublicRoute>
            ) : (
              <ProtectedRoute>
                <RatingList />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path={AppRoute.SIGNUP}
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path={AppRoute.COMPLETE_PROFILE}
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoute.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoute.NOTIFICATIONS}
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoute.NOTIFICATION}
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoute.COURSE}
          element={
            <ProtectedRoute>
              <Course />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoute.FORUM}
          element={
            <ProtectedRoute>
              <Forum />
            </ProtectedRoute>
          }
        />
        <Route path={AppRoute.NOT_FOUND} element={<NotFound />} />
        <Route path={AppRoute.SWAGGER} element={<SwaggerDocs />} />
      </Routes>
    </>
  );
}

export default App;
