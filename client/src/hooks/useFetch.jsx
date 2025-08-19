import { useEffect, useState } from "react";

const APIKEY = import.meta.env.VITE_GIPHY_API;

// Simple in-memory caches to avoid duplicate requests for the same keyword
const gifCache = new Map(); // keyword -> url
const pendingFetches = new Map(); // keyword -> Promise<string>

const FALLBACK_GIF_URL = "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284";

const normalizeKeyword = (k) => (k || "").trim().toLowerCase();

const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState("");

  useEffect(() => {
    const run = async () => {
      const normalized = normalizeKeyword(keyword);
      if (!normalized) {
        setGifUrl("");
        return;
      }

      // Serve from cache if available
      if (gifCache.has(normalized)) {
        setGifUrl(gifCache.get(normalized));
        return;
      }

      // Deduplicate concurrent requests for the same keyword
      if (pendingFetches.has(normalized)) {
        try {
          const url = await pendingFetches.get(normalized);
          setGifUrl(url || "");
        } catch (_) {
          setGifUrl(FALLBACK_GIF_URL);
        }
        return;
      }

      const fetchPromise = (async () => {
        try {
          // If no API key, short-circuit to fallback to avoid 429s on public/demo keys
          if (!APIKEY) {
            return FALLBACK_GIF_URL;
          }

          const searchParams = new URLSearchParams({
            api_key: APIKEY,
            q: normalized,
            limit: "1",
            rating: "g",
          });

          const url = `https://api.giphy.com/v1/gifs/search?${searchParams.toString()}`;
          const response = await fetch(url);

          if (!response.ok) {
            // 429 Too Many Requests or other errors
            throw new Error(`GIPHY request failed with status ${response.status}`);
          }

          const { data } = await response.json();
          const foundUrl = data?.[0]?.images?.downsized_medium?.url || "";
          return foundUrl || FALLBACK_GIF_URL;
        } catch (_) {
          return FALLBACK_GIF_URL;
        }
      })();

      pendingFetches.set(normalized, fetchPromise);

      try {
        const resolvedUrl = await fetchPromise;
        gifCache.set(normalized, resolvedUrl);
        setGifUrl(resolvedUrl);
      } finally {
        pendingFetches.delete(normalized);
      }
    };

    run();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;