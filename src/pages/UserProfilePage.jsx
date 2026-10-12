import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { Link } from "react-router-dom";

export default function UserProfilePage() {
  const { user } = useUser();
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setMyProducts(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6">Panel użytkownika</h1>

      {}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Twoje dane</h2>
        <div className="bg-gray-100 rounded-lg p-4">
          <p><strong>Nazwa użytkownika:</strong> {user.username}</p>
          <p><strong>Rola:</strong> {user.role}</p>
        </div>
      </section>

      {}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Twoje ogłoszenia</h2>

        {myProducts.length === 0 ? (
          <p className="text-gray-500">Nie dodałeś jeszcze żadnych ogłoszeń.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {myProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 text-white hover:bg-gray-700 transition"
              >
                {p.images?.length > 0 && (
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="text-gray-300">{p.price} zł</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
