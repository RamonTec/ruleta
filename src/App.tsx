import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import { OptionsList } from "./components/optionList";
import { RouletteWheel } from "./components/RouletteWheel";

const STORAGE_KEY = "roulette_options_v1";

function App() {
  const [options, setOptions] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
    } catch {
      // ignore storage errors
    }
  }, [options]);

  const trimmed = useMemo(() => draft.trim(), [draft]);

  const isDuplicate = useMemo(() => {
    const key = trimmed.toLocaleLowerCase();
    return key.length > 0 && options.some(o => o.toLocaleLowerCase() === key);
  }, [trimmed, options]);

  const canAdd = trimmed.length > 0 && !isDuplicate;

  const handleAddOption = () => {
    if (!trimmed) {
      toast.error("No se puede agregar una opción vacía");
      return;
    }
    if (isDuplicate) {
      toast.warning("Esa opción ya existe");
      return;
    }

    setOptions(prev => [...prev, trimmed]);
    setDraft("");
    toast.success(`Opción “${trimmed}” agregada`);
    // Mejor UX: vuelve a enfocar para agregar rápido
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const removeOption = (index: number) => {
    const removed = options[index];
    setOptions(prev => prev.filter((_, i) => i !== index));
    if (removed) toast.info(`Opción “${removed}” eliminada`);
  };

  const handleClearOptions = () => {
    if (options.length === 0) return;

    const shouldConfirm = options.length >= 5;
    if (shouldConfirm && !window.confirm("¿Seguro que quieres vaciar la lista?")) return;

    setOptions([]);
    toast.info("Lista vaciada");
    requestAnimationFrame(() => inputRef.current?.focus());
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
    <div className="bg-gradient-to-br from-indigo-50 via-white to-white rounded-3xl">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow-sm">
  
          <div className="px-6 pt-8 pb-6 md:px-10 border-b border-black/5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-indigo-700">
                  Ruleta 🎯
                </h1>
                <p className="mt-2 text-sm md:text-base text-slate-600">
                  Agrega opciones y gira para elegir una al azar.
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-indigo-100">
                  {options.length} opción{options.length === 1 ? "" : "es"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-2">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Ruleta</h2>
                <p className="text-sm text-slate-500">
                  {options.length < 2 ? "Agrega al menos 2 opciones" : "Listo para girar"}
                </p>
              </div>

              <div className="rounded-2xl ring-1 ring-black/5 bg-white p-4 md:p-6">
                {options.length > 0 ? (
                  <div className="mx-auto max-w-md">
                    <RouletteWheel options={options} onResult={handleResult} />
                  </div>
                ) : (
                  <div className="grid place-items-center py-12 text-center">
                    <div className="mx-auto max-w-sm">
                      <div className="text-3xl">🌀</div>
                      <p className="mt-3 font-medium text-slate-900">Aún no hay opciones</p>
                      <p className="mt-1 text-sm text-slate-600">
                        Escribe una opción a la derecha y presiona <span className="font-medium">Enter</span>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Opciones</h2>

                <button
                  onClick={handleClearOptions}
                  disabled={options.length === 0}
                  className="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded"
                >
                  Vaciar lista
                </button>
              </div>

              <div className="rounded-2xl ring-1 ring-black/5 bg-white p-4 md:p-5">
                <label className="sr-only" htmlFor="option-input">
                  Nueva opción
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <input
                      ref={inputRef}
                      id="option-input"
                      className={[
                        "w-full rounded-xl border bg-white px-4 py-3 shadow-sm outline-none transition",
                        "focus:ring-2 focus:ring-indigo-500",
                        "disabled:opacity-60",
                        isDuplicate ? "border-amber-300 focus:ring-amber-400" : "border-slate-200",
                      ].join(" ")}
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Ej: Pizza, Sushi, Tacos…"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddOption();
                      }}
                      autoComplete="off"
                    />

                    <div className="mt-2 text-xs">
                      {!trimmed ? (
                        <span className="text-slate-500">Tip: presiona Enter para agregar rápido.</span>
                      ) : isDuplicate ? (
                        <span className="text-amber-700">Ya existe esa opción (evita duplicados).</span>
                      ) : (
                        <span className="text-slate-500">Se agregará: <span className="font-medium text-slate-700">“{trimmed}”</span></span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleAddOption}
                    disabled={!canAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar
                  </button>
                </div>
              </div>

              <div className="rounded-2xl ring-1 ring-black/5 bg-white">
                {options.length === 0 ? (
                  <div className="p-6 text-sm text-slate-600">
                    Agrega opciones para verlas aquí.
                  </div>
                ) : (
                  <div className="max-h-[22rem] overflow-auto p-2">
                    <ul className="space-y-2">
                      {options.map((opt, idx) => (
                        <OptionsList
                          key={`${opt}-${idx}`}
                          option={opt}
                          index={idx}
                          removeOption={removeOption}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
