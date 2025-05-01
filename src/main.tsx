import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppLayout from "./app/layout"
import BrowsePage from "./app/browse/page"
import CreatePage from "./app/create/page"
import GovernancePage from "./app/governance/page"
import OrdersPage from "./app/orders/page"
import ProfilePage from "./app/profile/page"
import SellPage from "./app/sell/page"
import ValidatePage from "./app/validate/page"

import "./app/globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/validate" element={<ValidatePage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </React.StrictMode>
)
