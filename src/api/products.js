import api from "./client";

// Pobieranie produktów
export const getProducts = () => {
  return api.get("/api/products");
};

// Dodawanie produktu
export const addProduct = (product) => {
  return api.post("/api/products", product);
};

// Usuwanie produktu ⬇⬇⬇ DODANE
export const deleteProduct = (id) => {
  return api.delete(`/api/products/${id}`);
};

// edycja
export const updateProduct = (id, product) => {
  return api.put(`/api/products/${id}`, product);
};

export const getProductById = (id) => {
  return api.get(`/api/products/${id}`);
};

export const uploadProductImage = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/api/products/${id}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProductImage = (id, imageUrl) => {
  return api.delete(`/api/products/${id}/images`, {
    data: imageUrl,
  });
};
export const getAllProducts = async () => {
  const response = await fetch("http://localhost:8080/api/products");
  return response.json();
};


