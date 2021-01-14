import { RefObject, useEffect, useRef, useState } from 'react';

export function useIntersection<T extends HTMLElement>(threshold?: number | number[], margin?: string): [RefObject<T>, IntersectionObserverEntry?] {
  const ref = useRef<T>(null);
  const [intersection, setIntersection] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => setIntersection(entries[0]), {
      threshold,
      rootMargin: margin
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, margin]);

  return [ref, intersection];
}
