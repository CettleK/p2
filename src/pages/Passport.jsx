import React, { useState, useEffect } from "react";

const Passport = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [activeConditions, setActiveConditions] = useState([]);
  const [inactiveConditions, setInactiveConditions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/user/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile.");
        }

        const data = await response.json();
        setUserInfo({ fullName: data.name });

        // Separate active and inactive conditions
        setActiveConditions(data.active_conditions || []);
        setInactiveConditions(data.inactive_conditions || []);

      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserData();
  }, []);
  
  
  
  return (
      <div className="container mx-auto p-8 space-y-12 bg-gray-800">
        <h1 className="text-4xl font-bold text-center text-white">Health Passport</h1>

        {/* User Basic Info Section */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6 text-center">
          <h2 className="text-2xl font-semibold text-white">👤 User Profile</h2>
          {userInfo ? (
            <p className="text-gray-400 text-lg mt-2">{userInfo.fullName}</p>
          ) : (
            <p className="text-gray-500">Loading user data...</p>
          )}
        </div>

        {/* Active Conditions Section */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white">🩺 Active Medical Conditions</h2>
          {activeConditions.length > 0 ? (
            <ul className="list-disc list-inside text-gray-300 mt-2">
              {activeConditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No active medical conditions.</p>
          )}
        </div>

        {/* Inactive/Unknown Conditions Section */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white">📋 Past or Unknown Conditions</h2>
          {inactiveConditions.length > 0 ? (
            <ul className="list-disc list-inside text-gray-300 mt-2">
              {inactiveConditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No past or unknown conditions listed.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default Passport;