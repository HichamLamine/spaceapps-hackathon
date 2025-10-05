import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import AssistantPage from "./pages/AssistantPage";

function App() {
  return (
    <div className="m-3">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
