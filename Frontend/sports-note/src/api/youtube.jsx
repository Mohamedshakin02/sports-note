export const fetchVideos = async (query) => {
  try {
    const res = await fetch(`https://sports-note-backend.onrender.com/api/youtube?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Failed to fetch videos");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching videos:", err);
    return [];
  }
};
