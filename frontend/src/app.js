import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import CreateWork from "./pages/dashboard/CreateWork";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create" element={<CreateWork />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
