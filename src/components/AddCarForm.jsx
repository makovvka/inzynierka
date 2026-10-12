import { useState } from "react";
import LocationPicker from "./LocationPicker";
import { carData } from "../data/carData";

export default function AddCarForm({ onAdded }) {
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    description: "",
    city: "",
  });

  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setCar({
      ...car,
      brand,
      model: "",
    });
  };

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selected]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Proszę wybrać lokalizację na mapie!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musisz być zalogowany, aby dodać ogłoszenie.");
      return;
    }

    const carDataObj = {
      ...car,
      year: Number(car.year),
      price: Number(car.price),
      mileage: Number(car.mileage),
      latitude: location.lat,
      longitude: location.lng,
    };

    const formData = new FormData();
    formData.append("car", JSON.stringify(carDataObj));
    images.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/cars", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Błąd backendu:", text);
        alert("Nie udało się dodać ogłoszenia.");
        setLoading(false);
        return;
      }

      if (typeof onAdded === "function") {
        onAdded();
      }

      setCar({
        brand: "",
        model: "",
        year: "",
        price: "",
        mileage: "",
        description: "",
        city: "",
      });
      setImages([]);
      setLocation(null);
      setLoading(false);
    } catch (err) {
      console.error("Błąd dodawania samochodu:", err);
      alert("Wystąpił błąd podczas dodawania ogłoszenia.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#0f172a] text-white p-8 rounded-xl shadow-xl border border-slate-700"
    >
      <h2 className="text-3xl font-bold mb-4 text-center">Dodaj ogłoszenie</h2>

      {/* MARKA */}
      <select
        name="brand"
        size="1"
        className="
          w-full p-3 bg-slate-800 text-white
          border border-slate-600 rounded-lg 
          focus:border-blue-500 outline-none
          max-h-60 overflow-y-auto
        "
        value={car.brand}
        onChange={handleBrandChange}
        required
      >
        <option value="">Wybierz markę</option>
        {Object.keys(carData).map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {/* MODEL */}
      <select
        name="model"
        size="1"
        className="
          w-full p-3 bg-slate-800 text-white
          border border-slate-600 rounded-lg 
          focus:border-blue-500 outline-none
          disabled:opacity-40
          max-h-60 overflow-y-auto
        "
        value={car.model}
        onChange={handleChange}
        disabled={!car.brand}
        required
      >
        <option value="">Wybierz model</option>
        {car.brand &&
          carData[car.brand].map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
      </select>

      {/* NUMBER INPUTS */}
      <input
        name="year"
        type="number"
        placeholder="Rok"
        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 outline-none"
        value={car.year}
        onChange={handleChange}
        required
      />

      <input
        name="price"
        type="number"
        placeholder="Cena"
        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 outline-none"
        value={car.price}
        onChange={handleChange}
        required
      />

      <input
        name="mileage"
        type="number"
        placeholder="Przebieg"
        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 outline-none"
        value={car.mileage}
        onChange={handleChange}
        required
      />

      <input
        name="city"
        placeholder="Miasto"
        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 outline-none"
        value={car.city}
        onChange={handleChange}
        required
      />

      {/* OPIS */}
      <textarea
        name="description"
        placeholder="Opis pojazdu"
        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg h-32 focus:border-blue-500 outline-none"
        value={car.description}
        onChange={handleChange}
      />

      {/* MAPA */}
      <div>
        <label className="font-semibold mb-2 block">Lokalizacja pojazdu</label>
        <div className="border border-slate-600 rounded-xl overflow-hidden shadow-lg shadow-black/40">
          <LocationPicker position={location} onChange={setLocation} />
        </div>
      </div>

      {/* ZDJĘCIA */}
      <div>
        <label className="font-semibold block mb-3">Zdjęcia (możesz dodać wiele)</label>

        <input
          type="file"
          multiple
          onChange={handleFiles}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 cursor-pointer"
        />

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-24 object-cover rounded-lg border border-slate-600"
                  alt="preview"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-lg"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUBMIT */}
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-bold transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Dodawanie..." : "Dodaj ogłoszenie"}
      </button>
    </form>
  );
}
