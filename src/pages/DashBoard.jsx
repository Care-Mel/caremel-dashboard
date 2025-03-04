import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TermandCon from "../components/dashboard/TermandCon";
import Booking from "../components/dashboard/Booking";
import BookingDetail from "../components/dashboard/BookingDetail";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="/terms" element={<TermandCon />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        {/* Add more routes here as needed */}
      </Routes>
    </div>
  );
};

export default Dashboard;
