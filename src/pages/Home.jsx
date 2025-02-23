import { useState, useEffect } from "react";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state

  const fetchNews = () => {
    setLoading(true); // Set loading to true when fetching starts
    //fetch("https://plus2feed.vercel.app/news/")
    fetch("http://127.0.0.1:8000/news/")
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles || []); // Update articles
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setLoading(false); // Set loading to false if there's an error
      });
  };

  useEffect(() => {
    fetchNews(); // Fetch news on initial load
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Health News Feed</h1>

      {/* Refresh Button */}
      <button
        onClick={fetchNews} // Refresh the feed when clicked
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 transition-colors"
      >
        Refresh News
      </button>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center text-gray-500">
          <p>Loading...</p>
        </div>
      )}

      {/* Articles List */}
      {articles.map((article, index) => (
        <div key={index} className="p-4 border-b">
          <h2 className="text-lg font-semibold">{article.title}</h2>
          <p>{article.description}</p>
          <a href={article.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </div>
      ))}
    </div>
  );
};

export default Home;
