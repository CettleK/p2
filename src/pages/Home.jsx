import React, { useEffect, useState } from "react";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const [token, setToken] = useState(null); // Store token
  const [categories] = useState(["All", "Education", "Community", "Lifestyle", "Next Steps"]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Track selected category
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      console.log("✅ Retrieved Token:", storedToken);
      setToken(storedToken);
    }
    fetchNews(storedToken, selectedCategory);
    fetchInsights(storedToken); // 🔄 Fetch insights when component mounts
  }, [selectedCategory]); // 🔄 Fetch news whenever category changes

  const fetchNews = async (authToken, category) => {
    setLoading(true); // Set loading to true when fetching starts

    console.log("📡 Fetching news...");

    try {
      const response = await fetch(`http://127.0.0.1:8000/news/?category=${category}`, { // 🔄 Pass category
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });

      console.log("🔄 Response Status:", response.status); // 🔄 Debugging log for response status

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📰 News Data:", data); // 📰 Debugging log for received news data
      setArticles(data.articles || []);
    } catch (error) {
      console.error("❌ Error fetching news:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const fetchInsights = async (authToken) => {
    if (!authToken) return;

    console.log("📡 Fetching health insights...");

    try {
      const response = await fetch("http://127.0.0.1:8000/news/insights", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("🔄 Insights Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Insights Data:", data);
      setInsights(data.insights || []);
    } catch (error) {
      console.error("❌ Error fetching insights:", error);
    }
  };

  const handleArticleClick = async (articleUrl) => {
    const token = localStorage.getItem("token"); // Retrieve stored token
    if (!token) {
      console.error("No authentication token found.");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/track_click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 🔥 Fix: Add 'Bearer ' prefix
        },
        body: JSON.stringify({ link: articleUrl }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to log article click: ${errorText}`);
      } else {
        console.log(`Logged article click: ${articleUrl}`);
      }
    } catch (error) {
      console.error("Error logging article click:", error);
    }
  };
  return (
    <div className="container mx-auto p-8 space-y-12">
      <h1 className="text-2xl font-bold mb-4">Health Dashboard</h1>

      {/* Personalized Health Insights Section */}
      {insights.length > 0 && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="text-xl font-semibold">🔬 Health Insights</h2>
          <ul className="list-disc pl-5">
            {insights.map((insight, index) => (
              <li key={index} className="text-gray-700">{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Selector */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Refresh Button */}
      <button
        onClick={() => fetchNews(token, selectedCategory)} // 🔄 Refresh based on category
        className="bg-blue-500 text-black px-4 py-2 rounded mb-4 hover:bg-blue-600 transition-colors"
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
      {articles.length > 0 ? (
        articles.map((article, index) => (
          <div key={index} className="p-4 border-b flex items-center justify-between">
            <div className="flex-1 pr-4">
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <p>{article.description}</p>
            <a href={article.url} className="text-blue-500" target="_blank" rel="noopener noreferrer" onClick={() => handleArticleClick(article.url)}>
              Read more
            </a>
          </div>
          {article.image_url && (
          <img 
            src={article.image_url} 
            alt={article.title} 
            className="w-32 h-20 object-cover rounded-md shadow-md"
          />
          )}
          </div>
        ))
      ) : (
        !loading && <p className="text-center text-gray-500">No news available.</p>
      )}
    </div>
  );
};

export default Home;