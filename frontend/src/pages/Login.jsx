
import { useState } from "react";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = (event) => {

    event.preventDefault();

    setMessage("");

    // Check empty email
    if (email.trim() === "") {
        setMessage("Please enter your email address.");
        return;
    }

    // Check empty password
    if (password.trim() === "") {
        setMessage("Please enter your password.");
        return;
    }

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        setMessage("Please enter a valid email address.");
        return;
    }

    // Frontend validation completed
    setMessage("Validation successful. Ready to connect with backend.");

};

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Institute Management System</h1>

                <p>Welcome! Please login to continue.</p>

                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                    </div>

                    <button type="submit">
                        Login
                    </button>

                    {message && <p className="message">{message}</p>}

                </form>

            </div>

        </div>
    );
}

export default Login;
