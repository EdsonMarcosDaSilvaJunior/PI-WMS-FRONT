import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import Localizacoes from "./pages/Localizacoes";
import Usuarios from "./pages/Usuarios";
import Pedidos from "./pages/Pedidos";
import Movimentacoes from "./pages/Movimentacoes";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/localizacoes" element={<Localizacoes />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/movimentacoes" element={<Movimentacoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;