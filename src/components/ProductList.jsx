import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  uploadProductImage,
} from "../api/products";
import AddProductForm from "./AddProductForm";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);

  const navigate = useNavigate();

  
  const loadProducts = () => {
    getProducts().then((response) => {
      setProducts(response.data);
    });
  };


  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
  };


  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setNewImages([]);
    setIsModalOpen(true);
  };


  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewImages([]);
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

   
    const updatedProduct = {
      ...editingProduct,
    };

    delete updatedProduct.images; 
    delete updatedProduct.newImageFile;

    await updateProduct(editingProduct.id, updatedProduct);

    
    if (newImages.length > 0) {
      for (const file of newImages) {
        await uploadProductImage(editingProduct.id, file);
      }
    }

    loadProducts();
    closeEditModal();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200">
      <AddProductForm onProductAdded={loadProducts} />

      <h2 className="text-3xl font-bold mb-6 mt-8">Lista produktów</h2>

      {products.length === 0 && (
        <p className="text-gray-400">Brak produktów w bazie.</p>
      )}

      {}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 
                       cursor-pointer hover:bg-gray-700 transition"
          >
            {}
            {product.images?.length > 0 && (
              <img
                src={product.images[0]}
                alt="Miniatura"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="text-xl font-bold mb-2 text-white">
              {product.title}
            </h3>

            <p className="text-gray-300 mb-4">{product.description}</p>

            <p className="text-blue-400 font-semibold text-lg mb-4">
              {product.price} zł
            </p>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(product.id);
                }}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm"
              >
                Usuń
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(product);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm"
              >
                Edytuj
              </button>
            </div>
          </div>
        ))}
      </div>

      {}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Edytuj produkt</h2>

            <form onSubmit={handleUpdate} className="space-y-5">
              {}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Tytuł
                </label>
                <input
                  className="p-3 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Opis
                </label>
                <textarea
                  className="p-3 w-full bg-gray-100 border border-gray-300 rounded-lg h-28 resize-none"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              {}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Cena
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="p-3 w-full bg-gray-100 border border-gray-300 rounded-lg"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  }
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Dodaj dodatkowe zdjęcia
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setNewImages([...e.target.files])}
                  className="p-3 w-full"
                />
              </div>

              {}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="py-2 px-4 rounded-lg bg-gray-400 hover:bg-gray-500 text-white"
                >
                  Anuluj
                </button>

                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Zapisz zmiany
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
