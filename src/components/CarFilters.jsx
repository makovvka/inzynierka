import { useEffect, useState } from "react";
import { carData } from "../data/carData";

export default function CarFilters({ onFilter }) {
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    nearCity: "",
    radiusKm: "",
    sort: "",        
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/cars/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Błąd ładowania miast:", err));
  }, []);

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setFilters((prev) => ({
      ...prev,
      brand,
      model: "", 
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  const baseInputClasses =
    "w-full p-2.5 md:p-3 bg-slate-900 border border-slate-700 rounded-lg text-sm md:text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="bg-[#020617]/80 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-xl border border-slate-800 mb-8 text-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold">
          Filtruj ogłoszenia
        </h2>
        <button
          type="button"
          onClick={() => {
            const reset = {
              brand: "",
              model: "",
              minPrice: "",
              maxPrice: "",
              minYear: "",
              maxYear: "",
              nearCity: "",
              radiusKm: "",
              sort: "",
            };
            setFilters(reset);
            onFilter(reset);
          }}
          className="text-xs md:text-sm text-slate-300 hover:text-white underline underline-offset-4"
        >
          Wyczyść filtry
        </button>
      </div>

      <div className="grid gap-4 md:gap-5 md:grid-cols-4">
        {}
        <div className="md:col-span-1">
          <label className="block text-xs md:text-sm mb-1 text-slate-300">
            Marka
          </label>
          <select
            name="brand"
            className={baseInputClasses}
            value={filters.brand}
            onChange={handleBrandChange}
          >
            <option value="">Dowolna</option>
            {Object.keys(carData).map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {}
        <div className="md:col-span-1">
          <label className="block text-xs md:text-sm mb-1 text-slate-300">
            Model
          </label>
          <select
            name="model"
            className={baseInputClasses + " disabled:opacity-30"}
            value={filters.model}
            onChange={handleChange}
            disabled={!filters.brand}
          >
            <option value="">Dowolny</option>
            {filters.brand &&
              carData[filters.brand].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
          </select>
        </div>

        {}
        <div className="md:col-span-1">
          <label className="block text-xs md:text-sm mb-1 text-slate-300">
            Miasto (promień)
          </label>
          <select
            name="nearCity"
            className={baseInputClasses}
            value={filters.nearCity}
            onChange={handleChange}
          >
            <option value="">Dowolne</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {}
        <div className="md:col-span-1">
          <label className="block text-xs md:text-sm mb-1 text-slate-300">
            Promień
          </label>
          <select
            name="radiusKm"
            className={baseInputClasses}
            value={filters.radiusKm}
            onChange={handleChange}
          >
            <option value="">Dowolny</option>
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
            <option value="200">200 km</option>
          </select>
        </div>

        {}
        <div>
          <label className="block text-xs md:text-sm mb-1 text-slate-300">
            Cena od
          </label>
          <input
            type="number"
            name="minPrice"
            placeholder="np. 20000"
            className={baseInputClasses}
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>

        {}
        <div>
          <label className="block text-xs md:text-sm mb-1 text-slate-300">
            Cena do
          </label>
          <input
            type="number"
            name="maxPrice"
            placeholder="np. 80000"
            className={baseInputClasses}
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>

        {}
        <div>
          <label className="block text-xs md:text-sm mb-1 text-slate-300">
            Rok od
          </label>
          <input
            type="number"
            name="minYear"
            placeholder="np. 2010"
            className={baseInputClasses}
            value={filters.minYear}
            onChange={handleChange}
          />
        </div>

        {}
        <div>
          <label className="block text-xs md:text-sm mb-1 text-slate-300">
            Rok do
          </label>
          <input
            type="number"
            name="maxYear"
            placeholder="np. 2024"
            className={baseInputClasses}
            value={filters.maxYear}
            onChange={handleChange}
          />
        </div>

        {}
        <div className="md:col-span-2">
          <label className="block text-xs md:text-sm mb-1 text-slate-300">
            Sortuj według
          </label>
          <select
            name="sort"
            className={baseInputClasses}
            value={filters.sort}
            onChange={handleChange}
          >
            <option value="">Domyślnie (najnowsze)</option>
            <option value="price,asc">Cena: od najniższej</option>
            <option value="price,desc">Cena: od najwyższej</option>
            <option value="year,desc">Rok: nowsze pierwsze</option>
            <option value="year,asc">Rok: starsze pierwsze</option>
            <option value="mileage,asc">Przebieg: najmniejszy</option>
            <option value="mileage,desc">Przebieg: największy</option>
          </select>
        </div>
      </div>

      {}
      <button
        onClick={handleSearch}
        type="button"
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-base md:text-lg font-semibold shadow-lg shadow-blue-500/30 transition"
      >
        Szukaj
      </button>
    </div>
  );
}
