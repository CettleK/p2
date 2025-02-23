import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-50 bg-gray-900 text-white flex flex-col p-5 shadow-lg">
        
        <div className="mb-10 text-xl font-bold">Health App</div>
        
        <nav className="space-y-4">
            <Link to="/" className="block p-3 rounded-lg hover:bg-gray-700 transition-all duration-200">🏠 Home</Link>
            <Link to="/passport" className="block p-3 rounded-lg hover:bg-gray-700 transition-all duration-200">📜 Passport</Link>
            <Link to="/tracker" className="block p-3 rounded-lg hover:bg-gray-700 transition-all duration-200">📊 Tracker</Link>
            <Link to="/CommunityEngagement" className="block p-3 rounded-lg hover:bg-gray-700 transition-all duration-200">🌍 Community Engagement</Link>
            <Link to="/settings" className="block p-3 rounded-lg hover:bg-gray-700 transition-all duration-200">⚙️ Settings</Link>
        </nav>

        <div className="mt-auto">
            <button className="w-full p-3 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 text-black">
            🚪 Logout
            </button>
        </div>
    </div>
  );
};

export default Sidebar;