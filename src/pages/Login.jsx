import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login({ setIsAuthenticated  }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showRegister, setShowRegister] = useState(false);
    const [fhirId, setFhirId] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        console.log("🔐 Attempting login...");

        try {
            const response = await fetch("http://127.0.0.1:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Login successful. Token received:", data.token);

    
            const cleanToken = data.token.replace(/^Bearer\s+/i, "");
            localStorage.setItem("token", cleanToken);
            console.log("💾 Stored token (cleaned):", cleanToken);

           setIsAuthenticated(true);
           navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        console.log("📝 Attempting registration...");

        try {
            const response = await fetch("http://127.0.0.1:8000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, full_name: fullName, fhir_id: fhirId }), // Fixed full_name reference
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log("✅ Registration successful. You can now log in.");
            setShowRegister(false); // Switch back to login form
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div className="login-container">
            {showRegister ? (
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />&nbsp;&nbsp;
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />&nbsp;&nbsp;
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />&nbsp;&nbsp;
                    <input type="text" placeholder="FHIR ID" value={fhirId} onChange={(e) => setFhirId(e.target.value)} /><br></br>
                    <button type="submit">Register</button><br></br>
                    <button onClick={() => setShowRegister(false)}>Already have an account? Login</button>
                </form>
            ) : (
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />&nbsp;&nbsp;
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br></br><br></br>
                    <button type="submit">Login</button><br></br><br></br>
                    <button onClick={() => setShowRegister(true)}>Don't have an account? Register</button>
                </form>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
  }

export default Login;