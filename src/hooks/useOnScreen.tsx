import { RefObject, useEffect, useState } from "react";

/** 監聽物件是否於使用者可漸視窗內 */
export default function useOnScreen(
  ref: RefObject<HTMLElement | null>,
  rootMargin: string = "0px"
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { rootMargin }
    );

    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}