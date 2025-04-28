import * as React from "react";
import ManageUsers from "@/layouts/ManageUsers";
import AdminPanel from "./pages/dashboard/AdminPanel";
import ContentHome from "./_components/ContentHome";
import EventoInscricao from "./pages/dashboard/InscricaoEvento";
import InscricoesUsuario from "./pages/dashboard/InscricoesUsuario";
import { AppRoutes } from "./routes/AppRoutes";
function App() {
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
