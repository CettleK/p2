import { useState, useEffect } from "react";

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/news/")
      .then((response) => response.json())
      .then((data) => setArticles(data.articles || []))
      .catch((error) => console.error("Error fetching news:", error));
  }, []);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Health News Feed</h1>
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