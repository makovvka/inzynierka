import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        MotoMarket
      </Link>

      {}
      <nav className="flex items-center gap-4">

        {}
        {!user && (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Zaloguj
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Rejestracja
            </Link>
          </>
        )}

        {}
        {user && (
          <>
            <span className="text-gray-700 font-semibold">
              Witaj, <span className="text-blue-600">{user.username}</span>!
            </span>

            {}
            {user.role === "ROLE_USER" && (
              <Link
                to="/user/profile"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Mój profil
              </Link>
            )}

            {}
            {user.role === "ROLE_ADMIN" && (
              <Link
                to="/admin/products"
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Panel admina
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Wyloguj
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
