export const getMyCars = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:8080/api/cars/mine", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać ogłoszeń użytkownika");
  }

  return response.json();
};

// 🔥 obsługa WIELU zdjęć — przyjmuje już gotowe FormData!
export const addCar = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:8080/api/cars", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Błąd podczas dodawania samochodu");
  }

  return response.json();
};

export async function getFavorites() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:8080/api/cars/favorites", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!res.ok) throw new Error("Nie udało się pobrać ulubionych");
  return await res.json();
}

export async function addFavorite(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:8080/api/cars/favorites/${id}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!res.ok) throw new Error("Nie udało się dodać do ulubionych");
}

export async function removeFavorite(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:8080/api/cars/favorites/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!res.ok) throw new Error("Nie udało się usunąć z ulubionych");
}
