import React, { useState } from "react";

const Settings = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "********",
  });

  return (
    <div className="container mx-auto p-8 space-y-12 bg-blue-300">
      <h2 className="text-4xl font-bold text-center text-white">Account Settings</h2>

      <div className="mb-4">
        <label className="block text-white">Name</label>
        <input
          type="text"
          value={user.name}
          disabled
          className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white">Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white">Password</label>
        <input
          type="password"
          value={user.password}
          disabled
          className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>

      <button
        disabled
        className="w-full bg-blue-500 text-black py-2 px-4 rounded-md opacity-50 cursor-not-allowed"
      >
        Save Changes
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
        <button
          disabled
          className="w-full mt-2 bg-red-500 text-black py-2 px-4 rounded-md opacity-50 cursor-not-allowed"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
  };

export default Settings;