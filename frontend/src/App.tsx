import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import ApplicationForm from "./pages/ApplicationForm";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MentorArea from "./pages/MentorArea";
import MentorshipDetails from "./pages/MentorshipDetails";
import Mentorships from "./pages/Mentorships";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ScholarshipDetails from "./pages/ScholarshipDetails";
import Scholarships from "./pages/Scholarships";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bolsas" element={<Scholarships />} />
          <Route path="/bolsas/:id" element={<ScholarshipDetails />} />
          <Route path="/bolsas/:id/candidatura" element={<ProtectedRoute roles={["candidato"]}><ApplicationForm /></ProtectedRoute>} />
          <Route path="/mentorias" element={<Mentorships />} />
          <Route path="/mentorias/:id" element={<MentorshipDetails />} />
          <Route path="/checkout/:id" element={<ProtectedRoute roles={["candidato"]}><Checkout /></ProtectedRoute>} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/registar" element={<Register />} />
          <Route path="/painel" element={<ProtectedRoute roles={["candidato"]}><Dashboard /></ProtectedRoute>} />
          <Route path="/mentor" element={<ProtectedRoute roles={["mentor"]}><MentorArea /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["administrador"]}><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
