import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Veiculos } from "./pages/Veiculos";
import { Entregadores } from "./pages/Entregadores";
import { Hubs } from "./pages/Hubs";
import { Transacoes } from "./pages/Transacoes";
import { Entregas } from "./pages/Entregas";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="veiculos" element={<Veiculos />} />
          <Route path="entregadores" element={<Entregadores />} />
          <Route path="hubs" element={<Hubs />} />
          <Route path="transacoes" element={<Transacoes />} />
          <Route path="entregas" element={<Entregas />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
