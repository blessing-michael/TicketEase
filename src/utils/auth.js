// src/services/authService.js
// const USER_KEY = "ticketapp_user";
// const SESSION_KEY = "ticketapp_session";

// export function signupUser({ email, password }) {
//     localStorage.setItem(USER_KEY, JSON.stringify({ email, password }));
// }

// export function loginUser({ email, password }) {
//     const saved = JSON.parse(localStorage.getItem(USER_KEY));

//     if (!saved || saved.email !== email || saved.password !== password) {
//         throw new Error("Invalid email or password.");
//     }

//     const token = Math.random().toString(36).slice(2);
//     const session = { token, email, expires: Date.now() + 86400000 }; // 24 hours
//     localStorage.setItem(SESSION_KEY, JSON.stringify(session));
//     return session;
// }

// export function getSession() {
//     const s = localStorage.getItem(SESSION_KEY);
//     if (!s) return null;
//     const session = JSON.parse(s);
//     if (session.expires < Date.now()) {
//         localStorage.removeItem(SESSION_KEY);
//         return null;
//     }
//     return session;
// }

// export function logout() {
//     localStorage.removeItem(SESSION_KEY);
// }
