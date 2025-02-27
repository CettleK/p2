import { useEffect, useState } from "react";

const Tracker = () => {
  const [trackerData, setTrackerData] = useState(null);

  useEffect(() => {
      fetch("http://127.0.0.1:8000/user/tracker/", {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }
      })
      .then(response => response.json())
      .then(data => setTrackerData(data))
      .catch(error => console.error("Error fetching tracker stats:", error));
  }, []);

  return (
    <div className="container mx-auto p-8 space-y-12 bg-blue-300">
    <h1 className="text-4xl font-bold text-center text-white">
      Health Tracker
    </h1>
    <p className="text-gray-100 mb-4 text-center">
      Stay updated on your latest health stats.
    </p>

    {/* Health Metrics Section */}
    <div className="bg-blue-400 rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Your Health Stats
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trackerData ? (
          <>
            <div className="bg-blue-300 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-white">
                Blood Pressure
              </h3>
              <p className="text-gray-100">{trackerData.blood_pressure}</p>
            </div>
            <div className="bg-blue-300 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-white">
                Heart Rate
              </h3>
              <p className="text-gray-100">{trackerData.heart_rate}</p>
            </div>
            <div className="bg-blue-300 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-white">
                Blood Sugar
              </h3>
              <p className="text-gray-100">{trackerData.blood_sugar}</p>
            </div>
            <div className="bg-blue-300 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-white">Daily Steps</h3>
              <p className="text-gray-100">{trackerData.daily_steps}</p>
            </div>
            <div className="bg-blue-300 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-white">
                Water Intake
              </h3>
              <p className="text-gray-100">{trackerData.water_intake}</p>
            </div>
          </>
        ) : (
          <p className="text-gray-100">Loading tracker stats...</p>
        )}
      </div>
    </div>
     {/* Health Tips Section */}
     <div className="bg-blue-400 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Health & Wellness Tips
        </h2>
        <p className="text-gray-100">
          Improve your well-being with actionable health tips.
        </p>
        <ul className="list-disc list-inside text-gray-100 mt-4 text-left">
          <li>Stay hydrated and drink at least 8 glasses of water daily.</li>
          <li>Engage in at least 30 minutes of physical activity every day.</li>
          <li>Monitor your heart rate and blood pressure regularly.</li>
          <li>Maintain a balanced diet rich in vegetables and proteins.</li>
          <li>Ensure you get at least 7-8 hours of sleep for recovery.</li>
        </ul>
      </div>
    </div>
  );
  };
  export default Tracker;