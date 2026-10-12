import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getMyCars, getFavorites } from "../api/cars";
import AddCarForm from "../components/AddCarForm";

export default function UserPanel() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [myCars, favs] = await Promise.all([
        getMyCars(),
        getFavorites().catch(() => []),
      ]);
      setCars(myCars);
      setFavorites(favs);
    } catch (err) {
      console.error("Błąd pobierania danych panelu:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#020617] pt-24 px-4">
      <div className="max-w-6xl mx-auto text-white">
        <h1 className="text-4xl font-extrabold text-center mb-10">
          Panel użytkownika
        </h1>

        {user && (
          <p className="text-center text-slate-300 mb-8 text-sm">
            Zalogowano jako{" "}
            <span className="font-semibold text-blue-400">
              {user.username} ({user.email})
            </span>
          </p>
        )}

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {}
          <div className="bg-[#020617] border border-slate-700 rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Twoje ogłoszenia</h2>

            {loading ? (
              <p className="text-slate-400 text-sm">Ładowanie...</p>
            ) : cars.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Nie masz jeszcze żadnych ogłoszeń.
              </p>
            ) : (
              <div className="space-y-3">
                {cars.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between bg-slate-900/70 border border-slate-700 rounded-xl p-3 hover:border-blue-500 transition cursor-pointer"
                    onClick={() => navigate(`/car/${c.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      {c.images?.length > 0 && (
                        <img
                          src={`http://localhost:8080/api/cars/image/${c.images[0]}`}
                          alt={c.model}
                          className="w-20 h-16 object-cover rounded-lg border border-slate-700"
                        />
                      )}

                      <div>
                        <p className="font-semibold">
                          {c.brand} {c.model}
                        </p>
                        <p className="text-xs text-slate-400">
                          {c.year} • {c.mileage} km
                        </p>
                      </div>
                    </div>

                    <button
                      className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/car/${c.id}/edit`);
                      }}
                    >
                      Edytuj
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="bg-[#020617] border border-slate-700 rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Twoje ulubione</h2>

            {loading ? (
              <p className="text-slate-400 text-sm">Ładowanie...</p>
            ) : favorites.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Brak zapisanych ogłoszeń.
              </p>
            ) : (
              <div className="space-y-3">
                {favorites.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 bg-slate-900/70 border border-slate-700 rounded-xl p-3 hover:border-pink-500 transition cursor-pointer"
                    onClick={() => navigate(`/car/${c.id}`)}
                  >
                    {c.images?.length > 0 && (
                      <img
                        src={`http://localhost:8080/api/cars/image/${c.images[0]}`}
                        alt={c.model}
                        className="w-20 h-16 object-cover rounded-lg border border-slate-700"
                      />
                    )}

                    <div>
                      <p className="font-semibold">
                        {c.brand} {c.model}
                      </p>
                      <p className="text-xs text-slate-400">
                        {c.year} • {c.mileage} km
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {}
        <div className="flex justify-center mb-16">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold shadow-lg shadow-blue-500/40 flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Dodaj nowe ogłoszenie
          </button>
        </div>
      </div>

      {}
      {showAddForm && (
  <div className="fixed inset-0 bg-black/70 overflow-y-auto flex items-start justify-center z-50 py-10">
    <div className="max-w-3xl w-full mx-4">

      {}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddForm(false)}
          className="px-3 py-1 bg-slate-800 text-slate-100 rounded-lg text-sm hover:bg-slate-700"
        >
          Zamknij
        </button>
      </div>

      {}
      <AddCarForm
        onAdded={() => {
          setShowAddForm(false);
          loadData();
        }}
      />
    </div>
  </div>
)}
    </div>
  );
}
