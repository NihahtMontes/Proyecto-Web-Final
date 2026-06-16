import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/layout/Layout";

import HomePage from "./pages/public/HomePage";
import RoomsPage from "./pages/public/RoomsPage";
import RoomDetailPage from "./pages/public/RoomDetailPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";

function App() {
  return (
    <Routes>

      <Route element={<Layout />}>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/habitaciones"
          element={<RoomsPage />}
        />

        <Route
          path="/habitaciones/:id"
          element={<RoomDetailPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

      </Route>

    </Routes>
  );
}

export default App;