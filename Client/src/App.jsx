import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./page/HomePage";
import RegisterPage from "./page/registerPage";
import Howtouse from "./page/Howtouse";
import Moving from "./page/Moving";
import Repair from "./page/Repair";
import MovingList from "./page/MovingList";
import RepairList from "./page/RepairList";
import Repost from "./page/Repost";
import LoginPage from "./page/loginPage";
import AdminPage from "./page/AdminPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/Howtouse" element={<Howtouse />} />
          <Route path="/Moving" element={<Moving />} />
          <Route path="/Repair" element={<Repair />} />
          <Route path="/Repost" element={<Repost />} />
          <Route path="/MovingList" element={<MovingList />} />
          <Route path="/RepairList" element={<RepairList />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;