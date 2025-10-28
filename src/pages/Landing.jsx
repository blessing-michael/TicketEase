import { Link } from "react-router-dom";
import Header from "../components/Header"; // adjust path as needed
import "../styles/global.css";

export default function Landing() {
    return (
        <div className="landing-container">
            <Header /> {/* <-- Add this */}

            {/* Hero Section */}
            <section className="hero-section">
                <div className="max-width">
                    <div className="hero-content">
                        <h1>TicketEase</h1>
                        <p>Manage, track and resolve customer issues smoothly and efficiently.</p>

                        <div className="hero-buttons">
                            <Link to="/auth/login" className="btn-outline">Login</Link>
                            <Link to="/auth/signup" className="btn-filled">Get Started</Link>
                        </div>
                    </div>
                </div>

                <div className="hero-circle"></div>

                <svg className="hero-wave" viewBox="0 0 1440 320">
                    <path fill="#ffffff" fillOpacity="1"
                        d="M0,256L80,224C160,192,320,128,480,133.3C640,139,800,213,960,240C1120,267,1280,245,1360,234.7L1440,224V0H0Z">
                    </path>
                </svg>
            </section>

            {/* Features */}
            <section className="features max-width">
                <div className="feature-card">
                    <h3>Fast Ticket Creation</h3>
                    <p>Create new tickets in seconds and keep work moving smoothly.</p>
                </div>

                <div className="feature-card">
                    <h3>Team Collaboration</h3>
                    <p>Work together seamlessly to resolve issues quickly.</p>
                </div>

                <div className="feature-card">
                    <h3>Track Progress</h3>
                    <p>See ticket statuses at a glance and never miss a deadline.</p>
                </div>
            </section>

            <footer className="footer">
                <p>© {new Date().getFullYear()} TicketEase. All rights reserved.</p>
            </footer>
        </div>
    );
}
