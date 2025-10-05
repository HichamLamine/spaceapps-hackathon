import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AssistantPage from "./pages/AssistantPage";
import GetStartedPage from "./pages/GetStartedPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <div className="m-3">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GetStartedPage />} />
          <Route path="/accueil" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
