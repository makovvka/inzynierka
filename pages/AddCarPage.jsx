import { useNavigate } from "react-router-dom";
import AddCarForm from "../components/AddCarForm";

export default function AddCarPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white hover:bg-slate-700 transition"
      >
        ← Powrót
      </button>

      <AddCarForm
        onAdded={() => {
          
          navigate("/user-panel");
        }}
      />
    </div>
  );
}
