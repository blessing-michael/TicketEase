import React, { useState } from "react";
import { signupUser, loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Auth.css"; // reuse the same CSS as Login

export default function Signup() {
    const nav = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    function validate() {
        const e = {};
        if (!form.email.includes("@")) e.email = "Enter a valid email.";
        if (!form.password || form.password.length < 6)
            e.password = "Password must be at least 6 characters.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    const submit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            signupUser(form);   // Save user
            loginUser(form);    // Auto-login
            toast.success("Account created successfully!");
            nav("/dashboard");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">
                    Join TicketEase to manage your tickets efficiently
                </p>

                <form onSubmit={submit} noValidate className="auth-form">
                    <div className="field">
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>

                    <div className="field">
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>

                    <button type="submit" className="btn primary btn-full">
                        Create Account
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/auth/login">Login</Link>
                </p>
            </div>
        </div>
    );
}
