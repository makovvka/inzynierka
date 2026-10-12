import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LocationPicker from "../components/LocationPicker";

export default function CarEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    loadCar();
  }, [id]);

  const loadCar = async () => {
    const res = await fetch(`http://localhost:8080/api/cars/item/${id}`);
    const data = await res.json();

    setCar(data);
    setExistingImages(data.images || []);
    setLocation({
      lat: data.latitude,
      lng: data.longitude,
    });

    setLoading(false);
  };

  const handleDeleteExisting = async (img) => {
    if (!window.confirm("Usunąć zdjęcie?")) return;

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8080/api/cars/${id}/images`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ filename: img }),
    });

    setExistingImages(existingImages.filter((i) => i !== img));
  };

  const handleNewFiles = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const removeNewImage = (i) => {
    setNewImages(newImages.filter((_, idx) => idx !== i));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8080/api/cars/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        ...car,
        latitude: location?.lat,
        longitude: location?.lng,
      }),
    });

    if (newImages.length > 0) {
      const formData = new FormData();
      newImages.forEach((img) => formData.append("files", img));

      await fetch(`http://localhost:8080/api/cars/${id}/images`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
    }

    alert("Zapisano zmiany!");
    navigate(`/car/${id}`);
  };

  if (loading) return <p className="text-center mt-10 text-white">Ładowanie...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-20 bg-[#0f172a] p-10 rounded-2xl shadow-xl border border-slate-700 text-white">

      {}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition"
      >
        ← Powrót
      </button>

      <h1 className="text-3xl font-bold mb-8">Edytuj ogłoszenie</h1>

      <form className="space-y-6" onSubmit={handleSave}>

        {}
        <input
          value={car.brand}
          onChange={(e) => setCar({ ...car, brand: e.target.value })}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 outline-none"
          placeholder="Marka"
        />

        <input
          value={car.model}
          onChange={(e) => setCar({ ...car, model: e.target.value })}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 outline-none"
          placeholder="Model"
        />

        <input
          type="number"
          value={car.year}
          onChange={(e) => setCar({ ...car, year: Number(e.target.value) })}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 outline-none"
          placeholder="Rok"
        />

        <input
          type="number"
          value={car.price}
          onChange={(e) => setCar({ ...car, price: Number(e.target.value) })}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 outline-none"
          placeholder="Cena"
        />

        <input
          type="number"
          value={car.mileage}
          onChange={(e) => setCar({ ...car, mileage: Number(e.target.value) })}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 outline-none"
          placeholder="Przebieg"
        />

        <input
          value={car.city}
          onChange={(e) => setCar({ ...car, city: e.target.value })}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 outline-none"
          placeholder="Miasto"
        />

        <textarea
          value={car.description}
          onChange={(e) => setCar({ ...car, description: e.target.value })}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg h-32 focus:border-blue-500 outline-none"
          placeholder="Opis"
        />

        {}
        <div>
          <label className="font-semibold mb-2 block">Wybierz lokalizację</label>
          <div className="border border-slate-600 rounded-xl overflow-hidden shadow-lg shadow-black/40">
            <LocationPicker position={location} onChange={setLocation} />
          </div>
        </div>

        {}
        <div>
          <h3 className="font-semibold mb-2">Aktualne zdjęcia</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {existingImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={`http://localhost:8080/api/cars/image/${img}`}
                  className="w-full h-24 object-cover rounded-lg border border-slate-600"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(img)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-lg"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {}
        <div>
          <h3 className="font-semibold mb-2">Dodaj nowe zdjęcia</h3>

          <input
            type="file"
            multiple
            onChange={handleNewFiles}
            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
            {newImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-24 object-cover rounded-lg border border-slate-600"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-lg"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-bold transition">
          Zapisz zmiany
        </button>
      </form>
    </div>
  );
}
