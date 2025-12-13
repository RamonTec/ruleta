import { useState } from "react";
import "./App.css";
import { toast } from "react-toastify";
import { OptionsList } from "./components/optionList";
import confetti from "canvas-confetti";
import { RouletteWheel } from "./components/RouletteWheel";

function App() {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleAddOption = () => {
    if (!selectedOption?.trim()) {
      toast.error("No se puede agregar una opción vacía");
      return;
    }
    setOptions((prev) => [...prev, selectedOption.trim()]);
    toast.info(`Opción "${selectedOption}" agregada`);
    setSelectedOption(null);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Opción "${options[index]}" eliminada`);
  };

  const handleClearOptions = () => {
    setOptions([]);
    toast.info("Opciones eliminadas");
  };

  const handleConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleResult = () => {
    handleConfetti();
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-xl space-y-8">
        {/* Título */}
        <div className="text-center">
          <h1 className="text-5xl font-semibold text-indigo-600 mb-4">Ruleta</h1>
          <p className="text-gray-600 text-lg">Agrega opciones y selecciona una al azar</p>
        </div>

        {/* Input y botón de agregar opción */}
        <div className="flex gap-4 items-center justify-center">
          <input
            className="w-full max-w-md p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            type="text"
            value={selectedOption || ""}
            onChange={(e) => setSelectedOption(e.target.value)}
            placeholder="Ingresa una opción..."
            onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
          />
          <button
            onClick={handleAddOption}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition"
            disabled={!selectedOption}
          >
            <span className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span>Agregar</span>
            </span>
          </button>
        </div>

        {/* Ruleta */}
        {options.length > 0 ? (
          <div className="max-w-xs md:max-w-sm lg:max-w-md mx-auto mb-6">
            <RouletteWheel options={options} onResult={handleResult} />
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-200 rounded-xl text-gray-500">
            No hay opciones agregadas aún
          </div>
        )}

        {/* Lista de opciones y botón de vaciar lista */}
        {options.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Opciones ({options.length})</h2>
              <button
                onClick={handleClearOptions}
                className="text-red-500 hover:text-red-700 font-medium transition"
              >
                Vaciar lista
              </button>
            </div>

            <ul className="space-y-2">
              {options.map((opt, idx) => (
                <OptionsList key={idx} option={opt} index={idx} removeOption={removeOption} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
