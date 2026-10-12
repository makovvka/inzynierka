import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/products";
import { deleteProductImage } from "../api/products"; 


export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  


  const showNext = useCallback(() => {
    if (!product?.images?.length) return;
    setSelectedIndex((prev) => (prev + 1) % product.images.length);
  }, [product]);
  
  const handleDeleteImage = async (imgUrl) => {
  if (!window.confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return;

  await deleteProductImage(id, imgUrl);


  const updated = await getProductById(id);
  setProduct(updated.data);

 
  if (selectedIndex >= updated.data.images.length) {
    setSelectedIndex(0);
  }
};

  const showPrev = useCallback(() => {
    if (!product?.images?.length) return;
    setSelectedIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  }, [product]);

  
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handle = (e) => {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isLightboxOpen, showNext, showPrev]);

 
  useEffect(() => {
    getProductById(id).then((res) => {
      setProduct(res.data);

      if (res.data.images?.length) {
        setSelectedIndex(0);
      }
    });
  }, [id]);

  
  if (!product) {
    return (
      <p className="text-center mt-20 text-gray-500 text-xl">
        Ładowanie danych...
      </p>
    );
  }

  const images = product.images || [];
  const selectedImage = images[selectedIndex];

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">

      {}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
      >
        ← Powrót
      </button>

      {}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
        <p className="text-3xl font-extrabold text-blue-600 mt-4 md:mt-0">
          {product.price} zł
        </p>
      </div>

      {}
      <div
        className="w-full h-96 bg-gray-200 rounded-xl shadow-inner mb-6 flex justify-center items-center cursor-pointer"
        onClick={() => selectedImage && setIsLightboxOpen(true)}
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={product.title}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span className="text-gray-500 text-lg">Brak zdjęcia</span>
        )}
      </div>

    {}
{images.length > 0 && (
  <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
    {images.map((img, index) => (
      <div key={index} className="relative">

        {}
        <img
          src={img}
          onClick={() => setSelectedIndex(index)}
          className={`h-20 w-28 object-cover rounded-lg cursor-pointer border ${
            selectedIndex === index ? "border-blue-500 shadow-md" : "border-gray-300"
          }`}
          alt="miniatura"
        />

        {}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteImage(img);
          }}
          className="absolute -top-2 -right-2 bg-red-600 text-white text-xs 
                     rounded-full w-6 h-6 flex items-center justify-center 
                     hover:bg-red-700 shadow-md"
        >
          ✕
        </button>

      </div>
    ))}
  </div>
)}


      {}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Opis</h2>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300"
            >
              ×
            </button>

            {}
            {images.length > 1 && (
              <button
                onClick={showPrev}
                className="absolute left-4 text-white text-5xl font-bold hover:text-gray-300 select-none"
              >
                ‹
              </button>
            )}

            {}
            <img
              src={selectedImage}
              alt="powiększone"
              className="w-full max-h-[90vh] object-contain rounded-lg transition-all"
            />

            {}
            {images.length > 1 && (
              <button
                onClick={showNext}
                className="absolute right-4 text-white text-5xl font-bold hover:text-gray-300 select-none"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
