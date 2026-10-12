// src/api/messages.js

const BASE_URL = "http://localhost:8080";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: "Bearer " + token } : {};
}

// utworzenie / pobranie konwersacji dla ogłoszenia
export async function createOrGetConversationForCar(carId) {
  const res = await fetch(`${BASE_URL}/api/conversations/car/${carId}`, {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json", // body nie jest potrzebne, ale nagłówek nie zaszkodzi
    },
  });

  if (!res.ok) {
    throw new Error("Nie udało się utworzyć konwersacji.");
  }

  return await res.json(); // ConversationDto z backendu
}

// lista konwersacji zalogowanego użytkownika
export async function getMyConversations() {
  const res = await fetch(`${BASE_URL}/api/conversations`, {
    headers: {
      ...authHeader(),
    },
  });

  if (!res.ok) {
    throw new Error("Nie udało się pobrać konwersacji.");
  }

  return await res.json(); // List<ConversationDto>
}

// wiadomości w danej konwersacji
export async function getConversationMessages(conversationId) {
  const res = await fetch(
    `${BASE_URL}/api/conversations/${conversationId}/messages`,
    {
      headers: {
        ...authHeader(),
      },
    }
  );

  if (!res.ok) {
    throw new Error("Nie udało się pobrać wiadomości.");
  }

  return await res.json(); // List<MessageDto>
}

// wysłanie nowej wiadomości
export async function sendMessage(conversationId, content) {
  const res = await fetch(
    `${BASE_URL}/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!res.ok) {
    throw new Error("Nie udało się wysłać wiadomości.");
  }

  return await res.json(); // MessageDto
}
export async function deleteConversation(conversationId) {
  const res = await fetch(
    `${BASE_URL}/api/conversations/${conversationId}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (!res.ok) {
    throw new Error("Nie udało się usunąć konwersacji.");
  }
}
