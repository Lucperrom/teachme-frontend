import logo from './logo.svg';
import './App.css';
import RatingList from "./ratings";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import AppNavbar from "./AppNavbar";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  let userRoutes = (
    <>
      <Route path="/course/:id/ratings" exact={true} element={<RatingList />} />
    </>
  );

  return (
    <Router> {/* Añadir Router aquí */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppNavbar />
        <Routes>
          {userRoutes}
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
