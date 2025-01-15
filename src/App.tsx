import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient1 = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient1}>
      <ReactQueryDevtools initialIsOpen={false} />
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
    </QueryClientProvider>
  );
}
