import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import Login from './pages/Login';
import Register from "./pages/Register";


function App() {
  return (
   <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        {/* <Route path="/login" element={<Login/>} /> */}
      </Routes>
    </Router>
   </AuthProvider>
  );
}

export default App;
