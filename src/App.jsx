import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import Login from "./pages/landing/auth/Login";
import "./App.css";

function App() { return <BrowserRouter><Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></BrowserRouter>; }

export default App;
