import React, { useState, useEffect } from "react";

const Community = () => {
  const [groups, setGroups] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Example fetch from local JSON (you can replace this with an actual API)
    fetch("/supportGroups.json")
      .then((res) => res.json())
      .then((data) => setGroups(data));

    fetch("/testimonials.json")
      .then((res) => res.json())
      .then((data) => setTestimonials(data));
  }, []);

  const handleLinkClick = async (link) => {
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
          "Authorization": `Bearer ${token}`, // Pass authentication token
        },
        body: JSON.stringify({ link: link }), // Ensure correct format
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to log link click: ${errorText}`);
      } else {
        console.log(`Logged link click: ${link}`);
      }
    } catch (error) {
      console.error("Error logging link click:", error);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-12 bg-gray-800">
      <h1 className="text-4xl font-bold text-center text-white">Community Engagement</h1>

      {/* Support Groups Section */}
      <div className="bg-gray-900 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">🫂 Support Groups</h2>
        <p className="text-gray-400 mb-4">
          Connect with people who understand your journey
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => (
            <div key={group.name} className="bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-white">{group.name}</h3>
              <p className="text-sm text-gray-400">{group.type}</p>
              {group.location && (
                <p className="text-sm text-gray-500">{group.location}</p>
              )}
              <a
                href={group.link}
                className="text-blue-500 hover:underline mt-4 inline-block"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(group.link)} // 🆕 Tracking clicks
              >
                Join Now →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Health Resources Section (Newly Added) */}
      <div className="bg-gray-900 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">🌍 Health Resources</h2>
        <p className="text-gray-400 mb-4">
          Explore reliable health information from leading organizations
        </p>
        <ul className="space-y-4">
          {[
            { name: "🏥 CDC - Centers for Disease Control and Prevention", url: "https://www.cdc.gov/" },
            { name: "🌎 WHO - World Health Organization", url: "https://www.who.int/" },
            { name: "🏨 Mayo Clinic - Health Information & Research", url: "https://www.mayoclinic.org/" },
          ].map((resource, index) => (
            <li key={index}>
              <a
                href={resource.url}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(resource.url)} // 🆕 Tracking clicks
              >
                {resource.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-900 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">💬 Patient Stories</h2>
        <p className="text-gray-400 mb-4">
          Read inspiring testimonials from individuals managing their health conditions
        </p>
        <div className="space-y-6">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <p className="italic text-gray-300">"{t.story}"</p>
              <h3 className="mt-4 font-semibold text-white">- {t.name}</h3>
              <p className="text-sm text-gray-400">{t.condition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Submission Section */}
      <div className="bg-gray-900 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">📝 Share Your Story</h2>
        <form>
          <textarea
            placeholder="Write your story here..."
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg mb-6 resize-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-gray-400 px-8 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
          >
            Submit Story
          </button>
        </form>
      </div>
    </div>
  );
};

export default Community;
