import { useEffect, useState } from "react";

function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    const onChange = () => setMatches(matchMedia.matches);

    setMatches(matchMedia.matches);
    matchMedia.addEventListener("change", onChange);
    return () => matchMedia.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export default useMediaQuery;
