import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getConversationMessages,
  getMyConversations,
  sendMessage,
} from "../api/messages";

export default function ConversationPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();

  const [conversation, setConversation] = useState(
    location.state?.conversation || null
  );
  const [messages, setMessages] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    
    const ensureConversationMeta = async () => {
      if (conversation) return;
      try {
        const all = await getMyConversations();
        const found = all.find((c) => String(c.id) === String(id));
        if (found) setConversation(found);
      } catch (e) {
        console.error(e);
      }
    };

    ensureConversationMeta();
  }, [id, conversation]);

  useEffect(() => {
    loadMessages();
    
  }, [id]);

  const loadMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getConversationMessages(id);
      setMessages(data);
    } catch (e) {
      console.error(e);
      setError("Nie udało się pobrać wiadomości.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      setSending(true);
      const msg = await sendMessage(id, newContent.trim());
      setMessages((prev) => [...prev, msg]);
      setNewContent("");
    } catch (e) {
      console.error(e);
      alert("Nie udało się wysłać wiadomości.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-16 text-white flex flex-col h-[70vh]">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-sm"
      >
        ← Powrót
      </button>

      {}
      <div className="bg-[#0f172a] border border-slate-700 rounded-xl p-4 mb-4">
        <h1 className="text-xl font-bold mb-1">
          {conversation?.carTitle || "Rozmowa"}
        </h1>
        <p className="text-sm text-gray-300">
          Rozmowa z:{" "}
          <span className="font-semibold">
            {conversation?.otherUsername || ""}
          </span>
        </p>
      </div>

      {}
      <div className="flex-1 bg-[#020617] border border-slate-800 rounded-xl p-4 overflow-y-auto mb-4">
        {loading && <p>Ładowanie wiadomości...</p>}
        {!loading && error && (
          <p className="text-red-400">{error}</p>
        )}

        {!loading && !error && messages.length === 0 && (
          <p className="text-gray-400">
            Brak wiadomości w tej konwersacji. Napisz pierwszą wiadomość.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {messages.map((m) => {
            const isMe =
              currentUser &&
              currentUser.id &&
              m.senderId === currentUser.id;
            return (
              <div
                key={m.id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-br-sm"
                      : "bg-slate-700 text-white rounded-bl-sm"
                  }`}
                >
                  {!isMe && (
                    <div className="text-[10px] text-gray-200 mb-1">
                      {m.senderUsername}
                    </div>
                  )}
                  <div>{m.content}</div>
                  <div className="text-[9px] text-gray-200 mt-1 text-right">
                    {m.sentAt &&
                      new Date(m.sentAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {}
      <form
        onSubmit={handleSend}
        className="flex gap-2 items-center"
      >
        <textarea
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:border-emerald-500 resize-none h-16"
          placeholder="Napisz wiadomość..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button
          type="submit"
          disabled={sending}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
        >
          Wyślij
        </button>
      </form>
    </div>
  );
}
