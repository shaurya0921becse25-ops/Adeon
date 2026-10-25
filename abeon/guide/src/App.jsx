import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./data/AppContext";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import MyServices from "./pages/MyServices";
import AddService from "./pages/AddService";
import Calendar from "./pages/Calendar";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import Reviews from "./pages/Reviews";
import Earnings from "./pages/Earnings";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Verification from "./pages/Verification";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<MyServices />} />
            <Route path="/services/new" element={<AddService />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}