// src/services/authService.js

const USERS_KEY = "ticketapp_users";
const SESSION_KEY = "ticketapp_session";

// Load users array from storage
function loadUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

// Save users array
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Create session token
function createSession(email) {
    const session = {
        email,
        token: Math.random().toString(36).slice(2),
        expires: Date.now() + 1000 * 60 * 60 * 24 // 24h
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
}

// Return session if valid
export function getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session.expires || session.expires < Date.now()) {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
    return session;
}

// Signup: store user credentials
export function signupUser({ email, password }) {
    const users = loadUsers();
    if (users.find(u => u.email === email)) {
        throw new Error("Email already exists.");
    }
    users.push({ email, password });
    saveUsers(users);
}

// Login: verify credentials
export function loginUser({ email, password }) {
    const users = loadUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password.");
    return createSession(email);
}

// Logout
export function logout() {
    localStorage.removeItem(SESSION_KEY);
}
