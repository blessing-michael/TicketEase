import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Auth.css"; // create this CSS file

export default function Login() {
    const nav = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    function validate() {
        const e = {};
        if (!form.email.includes("@")) e.email = "Enter a valid email.";
        if (!form.password) e.password = "Password is required.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    const submit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            loginUser(form);
            toast.success("Login successful!");
            nav("/dashboard");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Log in to access your Dashboard and Tickets</p>

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

                    <button type="submit" className="btn primary btn-full">Login</button>
                </form>

                <p className="auth-footer">
                    No account? <Link to="/auth/signup">Create one</Link>
                </p>
            </div>
        </div>
    );
}
