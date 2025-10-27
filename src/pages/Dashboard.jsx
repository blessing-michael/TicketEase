// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { fetchTickets } from '../services/ticketService';
// import { Link, useNavigate } from 'react-router-dom';
// import { logout } from '../utils/authService';
// import { toast } from 'react-toastify';
// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getSession } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

export default function Dashboard() {
    const nav = useNavigate();
    const session = getSession();

    // Fake stats (replace with real data from backend later)
    const [stats, setStats] = useState({
        total: 24,
        open: 10,
        resolved: 14,
    });

    useEffect(() => {
        if (!session) {
            nav("/auth/login");
        }
    }, [session, nav]);

    return (
        <>
            {/* Header contains Logout */}
            <Header />

            {/* Main container: max-width 1440px, centered */}
            <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 16px" }}>
                {/* Page title */}
                <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>Dashboard</h1>

                {/* Welcome message */}
                <p>Welcome, <strong>{session?.email}</strong></p>

                {/* Stats Section */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "20px",
                        marginTop: "30px",
                        justifyContent: "space-between",
                    }}
                >
                    {[
                        { label: "Total Tickets", value: stats.total },
                        { label: "Open Tickets", value: stats.open },
                        { label: "Resolved Tickets", value: stats.resolved },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="card"
                            style={{
                                flex: "1 1 250px", // allows cards to shrink and wrap on small screens
                                padding: "20px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                textAlign: "center",
                                minWidth: "220px",
                                background: "#fff",
                            }}
                        >
                            <h3 style={{ marginBottom: "10px" }}>{item.label}</h3>
                            <p style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Navigation to Tickets */}
                <div style={{ marginTop: "40px" }}>
                    <Link to="/tickets" className="btn primary">
                        Go to Ticket Management →
                    </Link>
                </div>
            </div>

        </>
    );
}
