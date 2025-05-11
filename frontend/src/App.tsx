import { useState } from "react";

interface Review {
  name: string;
  rating: string;
  date: string;
  text: string;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setReviews([]);

    try {
      const res = await fetch("http://localhost:3001/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
      } else {
        setError(data.error || "Failed to fetch reviews.");
      }
    } catch (err) {
      setError("Server not reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Google Maps Review Scraper</h1>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          className="w-full md:w-2/3 p-3 border rounded shadow"
          placeholder="Enter Google Maps Link (e.g., https://g.co/kgs/...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleScrape}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow"
        >
          Scrape Reviews
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Scraping reviews...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-1">{review.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{review.date} | {review.rating}</p>
            <p className="text-gray-800">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
