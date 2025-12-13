
import { useState, useRef } from "react";
import clsx from "clsx";
import { describeArc, generateColors } from "../utils/svg";
import { useElementSize } from "../hooks/useElementSize";

type RouletteWheelProps = {
  options: string[];
  onResult: (winner: string, index: number) => void;
  size?: number;
};

export const RouletteWheel = ({
  options,
  onResult,
  size: propSize,
}: RouletteWheelProps) => {
  const { ref: wrapperRef, size: measuredSize } = useElementSize<HTMLDivElement>();
  const size = propSize ?? (measuredSize > 0 ? measuredSize : 300);
  const SPIN_DURATION = 5000;
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);

  const segmentCount = options.length;
  const segmentAngle = 360 / segmentCount;
  const radius = size / 2 - 6; 
  const cx = size / 2;
  const cy = size / 2;
  const colors = generateColors(segmentCount);
  const POINTER_ANGLE = 270;

    
  const spin = () => {
    if (isSpinning || segmentCount === 0) return;

    const randomIdx = Math.floor(Math.random() * segmentCount);

    const minTurns = 15;
    const maxTurns = 20;
    const fullTurns = minTurns + Math.random() * (maxTurns - minTurns);

    const landingAngle = randomIdx * segmentAngle + segmentAngle / 2;

    const currentMod = ((rotationRef.current % 360) + 360) % 360;
    let delta = (POINTER_ANGLE - landingAngle - currentMod) % 360;
    if (delta < 0) delta += 360;

    const targetDeg = rotationRef.current + fullTurns * 360 + delta;

    const el = wheelRef.current;
    if (!el) return;

    el.style.transition = "none";
    el.style.transform = `rotate(${rotationRef.current}deg)`;
    void el.offsetHeight;

    requestAnimationFrame(() => {
      el.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.1, 0.7, 0.1, 1)`;
      el.style.transform = `rotate(${targetDeg}deg)`;
    });

    setIsSpinning(true);
    setSelectedIdx(null);

    window.setTimeout(() => {
      setIsSpinning(false);
      setSelectedIdx(randomIdx);
      onResult(options[randomIdx], randomIdx);
      rotationRef.current = targetDeg;
    }, SPIN_DURATION);
  };

  const splitLabel = (txt: string): string[] => {
    if (txt.length <= 14) return [txt];
    const words = txt.split(" ");
    if (words.length === 1) return [txt.slice(0, Math.round(txt.length/2)), txt.slice(Math.round(txt.length/2))];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  };

  const baseFont = Math.max(10, Math.min(16, size / 20));
  const fontSize = segmentAngle < 30 ? baseFont * 0.8 : baseFont;

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={wrapperRef}
        className="relative w-full max-w-[420px] aspect-square font-bold"
        style={{ width: propSize ? `${size}px` : undefined }}
      >
        <div
          ref={wheelRef}
          className="absolute inset-0 will-change-transform"
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)"
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="overflow-visible"
          >
            {options.map((opt, i) => {
              const startAngle = i * segmentAngle;
              const endAngle = startAngle + segmentAngle;
              const path = describeArc(cx, cy, radius, startAngle, endAngle);
              
              const midAngle = startAngle + segmentAngle / 2;
              const textRadius = radius * 0.75;
              const angleRad = (midAngle * Math.PI) / 180;
              const tx = cx + textRadius * Math.cos(angleRad);
              const ty = cy + textRadius * Math.sin(angleRad);
              const lines = splitLabel(opt);

              const isSelected = i === selectedIdx;

              const strokeColor = isSelected ? "#FFD700" : "#fff";
              const strokeWidth = isSelected ? "8" : "2";

              return (
                <g key={i} className={isSelected ? "brightness-110 z-10" : ""}>
                  <path
                    d={path}
                    fill={colors[i % colors.length]}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
                  />
                  
                  <text
                    x={tx}
                    y={ty}
                    fill="white"
                    fontSize={fontSize}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle + 180}, ${tx}, ${ty})`}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                     {lines.map((line, idx) => (
                      <tspan 
                        key={idx} 
                        x={tx} 
                        dy={idx === 0 ? (lines.length > 1 ? "-0.4em" : "0.1em") : "1.1em"}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md z-10 border-2 border-gray-200" />
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || segmentCount === 0}
        className={clsx(
          "px-8 py-3 rounded-full font-bold text-white shadow-lg transform transition-all active:scale-95",
          isSpinning 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl"
        )}
      >
        {isSpinning ? "¡Girando!" : "GIRAR AHORA"}
      </button>
    </div>
  );
};