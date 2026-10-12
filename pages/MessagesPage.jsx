import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyConversations, deleteConversation } from "../api/messages";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await getMyConversations();
      setConversations(data);
    } catch (e) {
      console.error(e);
      setError("Nie udało się pobrać listy rozmów.");
    } finally {
      setLoading(false);
    }
  };

  const openConversation = (convo) => {
    navigate(`/messages/${convo.id}`, { state: { conversation: convo } });
  };

   const handleDelete = async (id) => {
    if (!window.confirm("Na pewno usunąć tę rozmowę?")) return;

    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
      alert("Nie udało się usunąć rozmowy.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 text-white">
      <h1 className="text-3xl font-bold mb-6">Wiadomości</h1>

      {loading && <p>Ładowanie...</p>}

      {!loading && error && (
        <p className="text-red-400 mb-4">{error}</p>
      )}

      {!loading && !error && conversations.length === 0 && (
        <p className="text-gray-400">
          Nie masz jeszcze żadnych rozmów.
        </p>
      )}

      <div className="flex flex-col gap-4">
         {conversations.map((c) => (
          <div
            key={c.id}
            className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-4 hover:bg-slate-800 transition flex justify-between items-center"
          >
            <button
              onClick={() => openConversation(c)}
              className="text-left flex-1"
            >
              <div>
                <p className="text-sm text-gray-400 mb-1">Ogłoszenie:</p>
                <p className="font-semibold text-lg">{c.carTitle}</p>
                <p className="text-sm text-gray-300 mt-1">
                  Rozmowa z:{" "}
                  <span className="font-semibold">
                    {c.otherUsername}
                  </span>
                </p>
                {c.lastMessage && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-1">
                    Ostatnia wiadomość: {c.lastMessage}
                  </p>
                )}
              </div>
            </button>

            <div className="flex flex-col items-end gap-2 ml-4">
              {c.lastMessageAt && (
                <div className="text-xs text-gray-400">
                  {new Date(c.lastMessageAt).toLocaleString()}
                </div>
              )}

              <button
                onClick={() => handleDelete(c.id)}
                className="text-xs px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
