import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isAuthenticated, handleLogout }) => {

    const location = useLocation();

  return (
    <div className="fixed top-0 left-0 h-full w-50 bg-blue-300 text-white flex flex-col p-5 shadow-lg">
        
        
        <div className="mb-10 text-xl font-bold">Health App</div>
        
        <nav className="space-y-4">
            <Link to="/"><button className="flex items-center  w-full p-3 bg-blue-300 rounded-lg hover:bg-red-600 transition-all duration-200 text-black"><img src="/home.png" alt="Tracker Icon" className="w-6 h-6" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Home</button></Link><br></br>
            <Link to="/Passport"><button className="flex items-center w-full p-3 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 text-black"><img src="/passport.png" alt="Tracker Icon" className="w-6 h-6" />&nbsp;&nbsp;&nbsp; Passport</button></Link><br></br>
            <Link to="/Tracker"><button className="flex items-center w-full p-3 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 text-black"><img src="/tracker.png" alt="Tracker Icon" className="w-6 h-6" />&nbsp;&nbsp;&nbsp;&nbsp; Tracker</button></Link><br></br>
            <Link to="/Community"><button className="flex items-center w-full p-3 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 text-black"><img src="/community.png" alt="Tracker Icon" className="w-6 h-6" /> Community</button></Link><br></br>
            <Link to="/Settings"><button className="flex items-center w-full p-3 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 text-black"><img src="/setting.png" alt="Tracker Icon" className="w-6 h-6" />&nbsp;&nbsp;&nbsp; Settings</button></Link><br></br>
        </nav>
        
        <div className="mt-auto">
            {isAuthenticated ? (
                <Link to="/login">
                    <button className="flex items-center w-full p-3 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 text-black" onClick={handleLogout}>
                    <img src="/login.png" alt="Tracker Icon" className="w-6 h-6" /> &nbsp;&nbsp;&nbsp;&nbsp;Logout
                    </button>
                </Link>
            ) : (
                <Link to="/login">
                    <button className="flex items-center w-full p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 text-black">
                    <img src="/login.png" alt="Tracker Icon" className="w-6 h-6" /> &nbsp;&nbsp;&nbsp;&nbsp;Login
                    </button>
                </Link>
            )}
        </div>
    </div>
  );
};

export default Sidebar;