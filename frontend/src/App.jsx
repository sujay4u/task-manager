import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import Login from './pages/Login';
import Register from "./pages/Register";
import Home from "./pages/Home";
import  PrivateRoute  from "./components/PrivateRoute";

function App() {
  return (
   <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={ <PrivateRoute>
            <Home />
          </PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
   </AuthProvider>
  );
}

export default App;
