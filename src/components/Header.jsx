import { Link, useNavigate } from "react-router-dom";
import { getSession, logout } from "../services/authService";
import { useState } from "react";
import "./Header.css";

export default function Header() {
    const user = getSession();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <header className="site-header">
            <div className="header-inner max-width">

                {/* Logo */}
                <Link to="/" className="logo">TicketEase</Link>

                {/* Navigation */}
                <nav className={`nav-links ${open ? "open" : ""}`}>
                    {user ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/tickets">Tickets</Link>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login">Login</Link>
                            <Link to="/auth/signup" className="cta-signup">Get Started</Link>
                        </>
                    )}
                </nav>

                {/* Hamburger (mobile) */}
                <div className={`hamburger ${open ? "active" : ""}`} onClick={() => setOpen(!open)}>
                    <span></span><span></span><span></span>
                </div>

            </div>
        </header>
    );
}
