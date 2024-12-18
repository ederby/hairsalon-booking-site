import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import Services from "./pages/Services";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import AppLayout from "./ui/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
