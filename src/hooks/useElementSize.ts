
import { useEffect, useState, useRef } from "react";

export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize(Math.min(rect.width, rect.height));
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, []);

  return { ref, size };
}
