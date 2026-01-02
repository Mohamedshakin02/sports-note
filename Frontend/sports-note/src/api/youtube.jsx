// Function to fetch YouTube videos based on a given title query

export const fetchVideos = async (query) => {
  try {
    // Sends a GET request to the backend
    const res = await fetch(`https://sports-note-backend.onrender.com/api/youtube?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Failed to fetch videos");
    const data = await res.json();

    // Returns the fetched video data
    return data;
  } catch (err) {
    console.error("Error fetching videos:", err);
    return [];
  }
};
