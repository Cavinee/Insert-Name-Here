import { Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"
import SellPage from "../pages/SellPage"
import GovernancePage from "../pages/GovernancePage"
import CreateServicePage from "../pages/CreateServicePage"
import ServicesPage from "../pages/ServicesPage"
import ServiceDetailPage from "../pages/ServiceDetailPage"
import OrdersPage from "../pages/OrdersPage"
import ProfilePage from "../pages/ProfilePage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import { OrderSummaryPage } from "@/pages/OrderSummaryPage"
// import ReviewPage from "../pages/ReviewPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/sell" element={<SellPage />} />
      <Route path="/governance" element={<GovernancePage />} />
      <Route path="/create" element={<CreateServicePage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/orders-dashboard/:id" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderSummaryPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* <Route path="/review/:id" element={<ReviewPage />} /> */}
    </Routes>
  )
}
