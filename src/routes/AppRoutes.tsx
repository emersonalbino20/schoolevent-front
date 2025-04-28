import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Importações das páginas
const Home = lazy(() => import("../pages/dashboard/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const AdminPanel = lazy(() => import("../pages/dashboard/AdminPanel"));
const InscricaoEvento = lazy(() => import("@/pages/dashboard/InscricaoEvento"));
const InscricoesUsuario = lazy(
  () => import("@/pages/dashboard/InscricoesUsuario")
);
const NotFound = lazy(() => import("../pages/dashboard/NotFound"));
const ComoInscrever = lazy(() => import("@/pages/dashboard/ComoInscrever"));
const Perfil = lazy(() => import("@/pages/dashboard/ComoInscrever"));

export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      }
    >
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/inscricao" element={<InscricaoEvento />} />
        <Route path="/inscricao-usuario" element={<InscricoesUsuario />} />
        <Route path="/como-inscrever-se" element={<ComoInscrever />} />
        {/* Página 404 */}
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
