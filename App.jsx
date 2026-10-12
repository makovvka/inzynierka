import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import ApiTestPage from "./pages/ApiTestPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPanel from "./pages/UserPanel";
import CarEditPage from "./pages/CarEditPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import AddCarPage from "./pages/AddCarPage";


import MessagesPage from "./pages/MessagesPage";
import ConversationPage from "./pages/ConversationPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <Navbar />

      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/car/:id" element={<CarDetailsPage />} />

          {/* Trasy tylko dla zalogowanych */}
          <Route
            path="/car/:id/edit"
            element={
              <ProtectedRoute>
                <CarEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-panel"
            element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-car"
            element={
              <ProtectedRoute>
                <AddCarPage />
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages/:id"
            element={
              <ProtectedRoute>
                <ConversationPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
