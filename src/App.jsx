import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import Login from "./pages/landing/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import TuitionDashboard from "./pages/dashboard/TuitionDashboard";
import HomeDashboard from "./pages/dashboard/HomeDashboard";
import MarketplaceDashboard from "./pages/dashboard/MarketplaceDashboard";
import "./App.css";

function App() { return <BrowserRouter><Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/homes" element={<HomeDashboard />} /><Route path="/tuition" element={<TuitionDashboard />} /><Route path="/marketplace" element={<MarketplaceDashboard />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></BrowserRouter>; }

export default App;
