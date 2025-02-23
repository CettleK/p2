import { useState, useEffect } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from "./pages/Home";
import Passport from "./pages/Passport";
import Tracker from "./pages/Tracker";
import Settings from "./pages/Settings";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  //const [count, setCount] = useState(0)<div >
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
}, []);

const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
};



  return (
    <Router>
      <div style={{ display: "flex" }}>  
        <Sidebar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />

        <div className="flex-1 p-6 ml-64">
          <Routes>
            <Route path="/" element= {<Home/>} />
            <Route path="/Passport" element= {<ProtectedRoute isAuthenticated={isAuthenticated}> <Passport/> </ProtectedRoute>} />
            <Route path="/Tracker" element= {<ProtectedRoute isAuthenticated={isAuthenticated}> {<Tracker/>} </ProtectedRoute>} />
            <Route path="/Settings" element= {<ProtectedRoute isAuthenticated={isAuthenticated}> {<Settings/>} </ProtectedRoute>} />
            <Route path="/Community" element= {<ProtectedRoute isAuthenticated={isAuthenticated}> {<Community/>} </ProtectedRoute>} />
            <Route path="/Login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          </Routes>
        </div>

      </div>
    </Router>
    
    /*
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React Help</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
    */

  )
}

export default App
