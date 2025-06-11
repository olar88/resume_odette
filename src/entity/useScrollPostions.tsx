import { useEffect, useState } from "react";
import { debounce } from "./debounce";

interface ScrollPostionsReturn {
  isAtTop: boolean;
  isAtBottom: boolean;
  positions: number;
}

export default function useScrollPostions(): ScrollPostionsReturn {
  const [isAtTop, setIsAtTop] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [positions, setPositions] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
     const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      setIsAtTop(scrollTop === 0);
      setIsAtBottom(scrollTop + windowHeight >= documentHeight);
      setPositions(scrollTop / (documentHeight - windowHeight));
    };

    // 防抖優化 (Debounce)
    const debouncedScroll = debounce(handleScroll, 50);

    window.addEventListener("scroll", debouncedScroll);
    handleScroll()
    return () => window.removeEventListener("scroll", debouncedScroll);
  }, []);

  return { isAtTop, isAtBottom, positions };
}
