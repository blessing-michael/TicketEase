// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import Tickets from "./pages/Tickets";
// import { isLoggedIn } from "./utils/authService";

// export default function App() {
//     return (
//         <BrowserRouter>
//             <Routes>

//                 {/* Public Pages */}
//                 <Route path="/" element={<Landing />} />
//                 <Route path="/auth/login" element={<Login />} />
//                 <Route path="/auth/signup" element={<Signup />} />

//                 {/* Protected Pages */}
//                 <Route
//                     path="/dashboard"
//                     element={isLoggedIn() ? <Dashboard /> : <Navigate to="/auth/login" />}
//                 />
//                 <Route
//                     path="/tickets"
//                     element={isLoggedIn() ? <Tickets /> : <Navigate to="/auth/login" />}
//                 />

//             </Routes>
//         </BrowserRouter>
//     );
// }

// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import { getSession } from "./services/authService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";

function PrivateRoute({ children }) {
    return getSession() ? children : <Navigate to="/auth/login" />;
}

export default function App() {
    return (
        <BrowserRouter>
            <ToastContainer position="top-right" />

            <Routes>
                {/* Public */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />

                {/* Protected */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/tickets"
                    element={
                        <PrivateRoute>
                            <Tickets />
                        </PrivateRoute>
                    }
                />

                {/* Catch-all (optional) */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
