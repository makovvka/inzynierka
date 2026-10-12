import { useState } from "react";
import { addProduct, uploadProductImage } from "../api/products";

export default function AddProductForm({ onProductAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFiles, setImageFiles] = useState([]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const newProduct = {
      title,
      description,
      price: parseFloat(price),
    };

    const response = await addProduct(newProduct);
    const productId = response.data.id;

 
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        await uploadProductImage(productId, file);
      }
    }

    
    setTitle("");
    setDescription("");
    setPrice("");
    setImageFiles([]);

    
    onProductAdded();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dodaj produkt</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Tytuł
          </label>
          <input
            className="p-3 w-full bg-gray-100 border border-gray-300 rounded-lg"
            placeholder="Wpisz tytuł"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Opis
          </label>
          <textarea
            className="p-3 w-full bg-gray-100 border border-gray-300 rounded-lg h-28 resize-none"
            placeholder="Wpisz opis produktu"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Cena
          </label>
          <input
            className="p-3 w-full bg-gray-100 border border-gray-300 rounded-lg"
            placeholder="0.00"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Zdjęcia produktu (możesz wybrać kilka)
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImageFiles([...e.target.files])}
            className="p-3 w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition shadow-md"
        >
          Dodaj produkt
        </button>
      </form>
    </div>
  );
}