import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
