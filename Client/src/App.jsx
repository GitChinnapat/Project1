import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./page/HomePage";
import RegisterPage from "./page/registerPage";  // ← เพิ่มนี้
import Howtouse from "./page/Howtouse";
import Moving from "./page/Moving";
import Repair from "./page/Repair";
import MovingList from "./page/MovingList";
import RepairList from "./page/RepairList";
import Repost from "./page/Repost";
import LoginPage from "./page/loginPage";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />  {/* ← เพิ่มนี้ */}
          <Route path="/Howtouse" element={<Howtouse />} />
          <Route path="/Moving" element={<Moving />} />
          <Route path="/Repair" element={<Repair />} />
          <Route path="/Repost" element={<Repost />} />
          <Route path="/MovingList" element={<MovingList />} />
          <Route path="/RepairList" element={<RepairList />} />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;