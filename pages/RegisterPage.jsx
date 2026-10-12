import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        setError("Użytkownik lub email już istnieje");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Błąd połączenia z serwerem");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl 
                      border border-slate-700 shadow-2xl rounded-2xl p-8 text-white">

        <h1 className="text-3xl font-bold text-center mb-6">Rejestracja</h1>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-5">

          <input
            type="text"
            placeholder="Login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg 
                       focus:border-blue-500 outline-none"
            required
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg 
                       focus:border-blue-500 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg 
                       focus:border-blue-500 outline-none"
            required
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg 
                       font-semibold transition"
          >
            Zarejestruj się
          </button>

        </form>

        <p className="text-center text-slate-300 mt-6">
          Masz już konto?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Zaloguj się
          </span>
        </p>

      </div>
    </div>
  );
}
