import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FavoritesPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Musisz być zalogowany, aby zobaczyć ulubione.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8080/api/cars/favorites", {
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Sesja wygasła, zaloguj się ponownie.");
        } else {
          setError("Nie udało się pobrać ulubionych.");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      setCars(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError("Wystąpił błąd podczas ładowania ulubionych.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 rounded"
      >
        ← Powrót
      </button>

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        ⭐ Twoje ulubione
      </h1>

      {loading && <p className="text-gray-600">Ładowanie...</p>}

      {!loading && error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {!loading && !error && cars.length === 0 && (
        <p className="text-gray-600">Nie masz jeszcze ulubionych ogłoszeń.</p>
      )}

      <div className="flex flex-col gap-4">
        {cars.map((car) => (
          <div
            key={car.id}
            onClick={() => navigate(`/car/${car.id}`)}
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50"
          >
            {}
            <img
              src={
                car.images && car.images.length > 0
                  ? `http://localhost:8080/api/cars/image/${car.images[0]}`
                  : "https://via.placeholder.com/120x80?text=Brak+zdjec"
              }
              className="w-32 h-24 object-cover rounded-lg border"
              alt="thumbnail"
            />

            {}
            <div>
              <h2 className="text-xl font-semibold">
                {car.brand} {car.model}
              </h2>
              <p className="text-gray-700">{car.price} zł</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
