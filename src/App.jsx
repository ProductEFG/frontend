import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthProvider } from "./providers/AuthProvider";
import Register from "./pages/Register";
import Leaderboards from "./pages/Leaderboards";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import { GlobalProvider } from "./providers/GlobalProvider";

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Router>
          <Routes>
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/home" element={<AdminHome />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
