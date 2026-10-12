import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createOrGetConversationForCar } from "../api/messages";

export default function CarDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadCar();
  }, [id]);

  useEffect(() => {
    checkFavorite();
  }, [car]);

  const loadCar = async () => {
    const res = await fetch(`http://localhost:8080/api/cars/item/${id}`);
    setCar(await res.json());
  };

  const checkFavorite = async () => {
    if (!localStorage.getItem("token") || !car) return;

    const res = await fetch("http://localhost:8080/api/cars/favorites", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });

    const data = await res.json();
    setIsFav(data.some((c) => c.id === Number(id)));
  };

  const startConversation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Zaloguj się, aby napisać do sprzedającego.");
      navigate("/login");
      return;
    }

    try {
      const convo = await createOrGetConversationForCar(id);
      
      navigate(`/messages/${convo.id}`, { state: { conversation: convo } });
    } catch (e) {
      console.error(e);
      alert("Nie udało się rozpocząć rozmowy ze sprzedającym.");
    }
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Zaloguj się!");

    
    const url = `http://localhost:8080/api/cars/favorites/${id}`;
    const method = isFav ? "DELETE" : "POST";

    await fetch(url, {
      method,
      headers: { Authorization: "Bearer " + token }
    });

    setIsFav(!isFav);
  };

  const nextImg = () => {
    if (!car.images?.length) return;
    setCurrentIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImg = () => {
    if (!car.images?.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  const handleDelete = async () => {
    if (!window.confirm("Usunąć ogłoszenie?")) return;

    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/cars/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    navigate("/user-panel");
  };

  if (!car) return <p className="text-center mt-10">Ładowanie...</p>;

  const isOwner = user?.username === car.owner?.username;

  return (
    <div className="max-w-5xl mx-auto mt-16 bg-[#0f172a] p-8 rounded-xl shadow-xl text-white border border-slate-700">

      {}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition"
      >
        ← Powrót
      </button>

      {}
      <button
        onClick={toggleFavorite}
        className="
          mb-6 px-4 py-2 rounded-lg font-semibold
          bg-pink-600 hover:bg-pink-700 transition
        "
      >
        {isFav ? "💔 Usuń z ulubionych" : "❤️ Dodaj do ulubionych"}
      </button>

      {}
      {!isOwner && (
        <button
          onClick={startConversation}
          className="
            mb-6 px-4 py-2 rounded-lg font-semibold
            bg-emerald-600 hover:bg-emerald-700 transition
          "
        >
          💬 Napisz do sprzedającego
        </button>
      )}

      {}
      <div className="relative w-full h-[420px] bg-black rounded-xl overflow-hidden mb-6 flex items-center justify-center shadow-lg shadow-black/50">

        {car.images?.length > 0 ? (
          <img
            src={`http://localhost:8080/api/cars/image/${car.images[currentIndex]}`}
            className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition"
            onClick={() => setFullscreen(true)}
          />
        ) : (
          <p className="text-gray-300">Brak zdjęć</p>
        )}

        {car.images?.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 px-3 py-2 rounded-lg"
            >
              ◀
            </button>

            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 px-3 py-2 rounded-lg"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {}
      {car.images?.length > 1 && (
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {car.images.map((img, idx) => (
            <img
              key={idx}
              src={`http://localhost:8080/api/cars/image/${img}`}
              onClick={() => setCurrentIndex(idx)}
              className={`
                h-24 w-36 object-cover rounded-lg cursor-pointer border-2 transition
                ${idx === currentIndex ? "border-blue-500 scale-105" : "border-slate-600 hover:border-slate-400"}
              `}
            />
          ))}
        </div>
      )}

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {}
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {car.brand} {car.model} ({car.year})
          </h1>

          <p className="text-3xl text-blue-400 font-bold mb-6">
            {car.price} zł
          </p>

          <p className="mb-3 text-lg"><b>Przebieg:</b> {car.mileage} km</p>
          <p className="mb-3 text-lg"><b>Miasto:</b> {car.city}</p>

          <p className="text-lg opacity-90">
            <b>Opis:</b><br />{car.description}
          </p>

          {isOwner && (
            <div className="flex gap-4 mt-10">
              <button
                onClick={() => navigate(`/car/${id}/edit`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Edytuj
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Usuń
              </button>
            </div>
          )}
        </div>

        {}
        <div>
          <h2 className="text-2xl font-bold mb-4">Lokalizacja</h2>
          {car.latitude && car.longitude ? (
            <div className="border border-slate-600 rounded-xl overflow-hidden shadow-lg shadow-black/40">
              <MapContainer
                center={[car.latitude, car.longitude]}
                zoom={13}
                className="h-64 w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[car.latitude, car.longitude]} />
              </MapContainer>
            </div>
          ) : (
            <p className="text-gray-400">Brak lokalizacji</p>
          )}
        </div>
      </div>

      {}
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setFullscreen(false)}
        >
          <img
            src={`http://localhost:8080/api/cars/image/${car.images[currentIndex]}`}
            className="max-w-5xl max-h-[95vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}
