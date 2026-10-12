import { useEffect, useState } from "react";
import CarFilters from "../components/CarFilters";
import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  const applyFilters = async (filters) => {
    let params = [];

    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.push(`${key}=${encodeURIComponent(filters[key])}`);
    });

    const query = params.length ? "?" + params.join("&") : "";
    const res = await fetch("http://localhost:8080/api/cars" + query);
    const data = await res.json();

    setCars(data.content || data);
  };

  useEffect(() => {
    applyFilters({});
  }, []);

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto">

      {}
      <h1 className="text-5xl font-extrabold text-white mb-10 text-center tracking-tight">
        Znajdź swój wymarzony samochód
      </h1>

      {}
      <CarFilters onFilter={applyFilters} />

      {}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {cars.length === 0 && (
          <p className="text-slate-400 text-xl col-span-full text-center">
            Brak wyników dla wybranych filtrów 😔
          </p>
        )}

        {cars.map((car) => (
          <div
            key={car.id}
            onClick={() => navigate(`/car/${car.id}`)}
            className="
              bg-[#1e293b] border border-slate-700 rounded-xl shadow-lg shadow-black/40 
              hover:shadow-blue-600/30 hover:border-blue-600 transition cursor-pointer
            "
          >
            {}
            {car.images?.length > 0 ? (
              <img
                src={`http://localhost:8080/api/cars/image/${car.images[0]}`}
                className="w-full h-48 object-cover rounded-t-xl"
                alt="zdjęcie auta"
              />
            ) : (
              <div className="w-full h-48 bg-slate-700 rounded-t-xl flex items-center justify-center">
                <span className="text-slate-400">Brak zdjęcia</span>
              </div>
            )}

            {}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white">
                {car.brand} {car.model}
              </h3>

              <p className="text-slate-400 mt-1">
                {car.year} • {car.mileage} km
              </p>

              <p className="text-blue-400 font-bold text-2xl mt-3">
                {car.price} zł
              </p>

              <p className="text-slate-300 mt-2 flex items-center gap-1">
                📍 {car.city}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
