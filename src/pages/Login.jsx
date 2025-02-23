import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Test username: ushionoa@mss.com
//Test password: gomenyuuka

function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error("Username or password is incorrect");

            const data = await response.json();
            localStorage.setItem("token", data.token);  // Save JWT token
            setIsAuthenticated(true);  // Update authentication state
            navigate("/");  // Redirect to Home
        } catch (err) {
            setError(err.message);
        }
    };

    return (
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
      </div>
    );
}
  
export default Login;