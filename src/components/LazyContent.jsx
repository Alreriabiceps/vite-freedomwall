import { useState, useRef, useEffect } from "react";

function LazyContent({
  children,
  className = "",
  placeholder = null,
  threshold = 0.1,
}) {
  const [isInView, setIsInView] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before content comes into view
        threshold,
      }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={contentRef} className={className}>
      {isInView
        ? children
        : placeholder || (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          )}
    </div>
  );
}

export default LazyContent;
