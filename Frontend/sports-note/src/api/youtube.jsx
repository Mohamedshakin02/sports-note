import axios from "axios";

const API_KEY = "AIzaSyCKvnpbKYu8KhTpqctTE8PRPiSP8v01FGw"; 

export const fetchVideos = async (query) => {
  const res = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      params: {
        part: "snippet",
        q: query,
        maxResults: 3,
        type: "video",
        key: API_KEY,
      },
    }
  );

  return res.data.items;
};
