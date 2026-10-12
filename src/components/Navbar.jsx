import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur bg-black/30 border-b border-white/10 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <Link to="/" className="text-2xl font-bold text-white">
          AutoMarket
        </Link>

        <div className="flex gap-4">

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
              >
                Logowanie
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Rejestracja
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/user-panel"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Panel użytkownika
              </Link>

              <Link
                to="/messages"
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
              >
                Wiadomości
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Wyloguj
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}