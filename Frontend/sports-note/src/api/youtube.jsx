export const fetchVideos = async (query) => {
  try {
    const res = await fetch(`http://localhost:5000/api/youtube?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Failed to fetch videos");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching videos:", err);
    return [];
  }
};
