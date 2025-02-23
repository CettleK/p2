import React, { useState, useEffect } from "react";

const CommunityEngagement = () => {
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

  return (
    <div className="container mx-auto p-8 space-y-12 bg-gray-800">
      <h1 className="text-4xl font-bold text-center text-white">Community Engagement</h1>

      {/* Support Groups Section */}
      <div className="bg-gray-900 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">🫂 Support Groups</h2>
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
              >
                Join Now →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-900 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">💬 Patient Stories</h2>
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
            className="bg-blue-500 text-white px-8 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
          >
            Submit Story
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunityEngagement;
