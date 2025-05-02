import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Calendar,
  LogOut,
  Menu,
  X,
  User,
  CalendarDays,
  CalendarIcon,
  Clock,
  MapPin,
  Award,
} from "lucide-react";
import ManageUsers from "@/layouts/ManageUsers";
import { HiOutlineTrophy } from "react-icons/hi2";
import { VscFeedback } from "react-icons/vsc";
import { FaRegCommentDots } from "react-icons/fa6";
import LOGO from "@/assets/images/logo.png";
import ManageProfile from "@/layouts/ManageProfile";
import ManageEvents from "@/layouts/ManageEvents";
import ManageComments from "@/layouts/ManageComments";
import { useGetEventos } from "@/api/eventoQuery";

// Importando os componentes UI do primeiro componente
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserData, clearUserData } from "@/hooks/AuthLocal";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const AdminPanel = () => {
  const navigate = useNavigate();
  const usuario = getUserData();
  function handleLogout() {
    clearUserData(navigate);
  }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [select, setSelect] = useState(
    usuario.tipo === "aluno" ? "profile" : "dashboard"
  );
  const { data: eventos = [] } = useGetEventos();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Dashboard component functions
  const totalEvents = eventos?.length || 0;
  const totalParticipants =
    eventos?.reduce(
      (acc, evento) => acc + (evento.inscricoes ? evento.inscricoes.length : 0),
      0
    ) || 0;
  const totalDestaques =
    eventos?.reduce(
      (acc, evento) => acc + (evento.destaques ? evento.destaques.length : 0),
      0
    ) || 0;

  // Get upcoming events (events that haven't ended yet)
  const now = new Date();
  const upcomingEvents =
    eventos?.filter((evento) => new Date(evento.data_fim) > now) || [];

  // Count events by location
  const eventsByLocation =
    eventos?.reduce((acc, evento) => {
      const location = evento?.local || "Sem local";
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {}) || {};

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get initials for avatar fallback
  const getInitials = (name, surname) => {
    return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`.toUpperCase();
  };

  // Dashboard component
  const Dashboard = () => (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Badge variant="outline" className="bg-blue-50">
          {new Date().toLocaleDateString("pt-BR")}
        </Badge>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Eventos
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingEvents?.length} eventos futuros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              {(totalParticipants / Math.max(totalEvents, 1)).toFixed(1)} média
              por evento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Destaques</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDestaques}</div>
            <p className="text-xs text-muted-foreground">Alunos em destaque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Locais</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(eventsByLocation || {}).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Locais diferentes utilizados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="locations">Distribuição por Local</TabsTrigger>
          <TabsTrigger value="destaques">Destaques</TabsTrigger>
        </TabsList>

        {/* Upcoming Events Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <Alert>
              <AlertTitle>Nenhum evento futuro encontrado</AlertTitle>
              <AlertDescription>
                Não há eventos agendados para os próximos dias.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingEvents.map((evento) => (
                <Card key={evento.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{evento.titulo}</CardTitle>
                      <Badge>{evento.inscricoes?.length || 0} inscritos</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {evento.descricao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>
                        {formatDate(evento.data_inicio)} -{" "}
                        {formatDate(evento.data_fim)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{evento.local}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4" />
                      <span>
                        Criado por: {evento.criador?.nome}{" "}
                        {evento.criador?.sobrenome}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos por Local</CardTitle>
              <CardDescription>
                Distribuição de eventos por local de realização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(eventsByLocation).map(([location, count]) => (
                <div key={location} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{location}</span>
                    <span className="font-medium">
                      {count as number} eventos
                    </span>
                  </div>
                  <Progress value={((count as number) / totalEvents) * 100} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Destaques Tab */}
        <TabsContent value="destaques" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alunos em Destaque</CardTitle>
              <CardDescription>
                Reconhecimentos e menções de destaque em eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!eventos || eventos.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  Nenhum evento encontrado.
                </div>
              ) : (
                <>
                  {eventos.flatMap(
                    (evento) =>
                      evento.destaques?.map((destaque) => (
                        <div
                          key={`${evento.id}-${destaque.aluno?.email}`}
                          className="flex items-center space-x-4 py-3 border-b last:border-0"
                        >
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(
                                destaque.aluno?.nome,
                                destaque.aluno?.sobrenome
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                              <p className="font-medium">
                                {destaque.aluno?.nome}{" "}
                                {destaque.aluno?.sobrenome}
                              </p>
                              <Badge variant="outline">
                                {destaque.aluno?.email}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Destaque em: {evento.titulo}
                            </p>
                          </div>
                        </div>
                      )) || []
                  )}

                  {totalDestaques === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      Nenhum aluno em destaque registrado nos eventos.
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Componente do Sidebar para reutilização
  const SidebarContent = () => (
    <>
      <div className="p-4 flex items-center space-x-2">
        <img
          src={LOGO}
          className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 object-contain"
          alt="Logo"
        />
        <h1 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">
          RadlukActividades
        </h1>
      </div>

      <nav className="mt-8 flex-1">
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
          Principal
        </div>
        <Link to={"/"}>
        {usuario.tipo === "administrador" ? (
          ""
        ) : (
          <a
            href="#"
            className={`flex items-center px-4 py-3 ${"text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"}`}
          >
            <FaHome size={20} className="mr-3" />
            <span>Home</span>
          </a>)}
        </Link>
        {usuario.tipo === "aluno" ? (
          ""
        ) : (
          <a
            href="#"
            onClick={() => {
              setSelect("dashboard");
            }}
            className={`flex items-center px-4 py-3 ${
              select === "dashboard"
                ? "text-white bg-gray-800"
                : "text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            }`}
          >
            <BarChart3 size={20} className="mr-3" />
            <span>Dashboard</span>
          </a>
        )}
        {usuario.tipo === "aluno" ? (
          ""
        ) : (
          <a
            href="#"
            onClick={() => {
              setSelect("eventos");
            }}
            className={`flex items-center px-4 py-3 ${
              select === "eventos"
                ? "text-white bg-gray-800"
                : "text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            }`}
          >
            <Calendar size={20} className="mr-3" />
            <span>Actividades</span>
          </a>
        )}
        {usuario.tipo === "administrador" && (
          <a
            href="#"
            onClick={() => {
              setSelect("users");
            }}
            className={`flex items-center px-4 py-3 ${
              select === "users"
                ? "text-white bg-gray-800"
                : "text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            }`}
          >
            <Users size={20} className="mr-3" />
            <span>Usuários</span>
          </a>
        )}

        <a
          href="#"
          onClick={() => {
            setSelect("profile");
          }}
          className={`flex items-center px-4 py-3 ${
            select === "profile"
              ? "text-white bg-gray-800"
              : "text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          }`}
        >
          <User size={20} className="mr-3" />
          <span>Meu Perfil</span>
        </a>
        {usuario.tipo === "administrador" && (
          <a
            href="#"
            onClick={() => {
              setSelect("destaques");
            }}
            className={`flex items-center px-4 py-3 ${
              select === "quadras"
                ? "text-white bg-gray-800"
                : "text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            }`}
          >
            <HiOutlineTrophy size={20} className="mr-3" />
            <span>Destaques</span>
          </a>
        )}
        {usuario.tipo === "professor" && (
          <a
            href="#"
            onClick={() => {
              setSelect("modulo");
            }}
            className={`flex items-center px-4 py-3 ${
              select === "modulo"
                ? "text-white bg-gray-800"
                : "text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            }`}
          >
            <VscFeedback size={20} className="mr-3" />
            <span>Meus Feedbacks</span>
          </a>
        )}
        {(usuario.tipo === "aluno" || usuario.tipo === "professor") && (
          <a
            href="#"
            onClick={() => setSelect("comments")}
            className={`flex items-center px-4 py-3 ${
              select === "comments"
                ? "text-white bg-gray-800"
                : "text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            }`}
          >
            <FaRegCommentDots size={20} className="mr-3" />
            <span>Comentários</span>
          </a>
        )}

        <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase">
          Configurações
        </div>
        <a
          href="#"
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mt-auto"
        >
          <LogOut size={20} className="mr-3" />
          <span>Sair</span>
        </a>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-xs text-gray-400">Usuário {usuario?.tipo}</p>
          <p className="font-medium">
            {usuario?.nome} {usuario?.sobrenome}
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Sidebar (overlay) */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-gray-600 opacity-75"
          onClick={toggleSidebar}
        ></div>

        {/* Sidebar */}
        <div className="relative flex flex-col w-64 h-full bg-gray-900 text-white">
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      <div className="hidden lg:flex flex-col w-64 bg-gray-900 text-white fixed h-full">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 flex-1">
        {/* Top Navigation for Mobile */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-gray-600 p-2 hover:text-gray-900 mr-2"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center lg:hidden">
                <img
                  src={LOGO}
                  className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12"
                  alt="Logo"
                />
                <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 ml-2">
                  RadlukActividades
                </h2>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 hidden lg:block">
                Painel Administrativo
              </h2>
            </div>
          </div>
        </header>

        {/* Content */}
        {select === "dashboard" && <Dashboard />}
        {select === "users" && <ManageUsers />}
        {select === "profile" && <ManageProfile />}
        {select === "eventos" && <ManageEvents />}
        {select === "comments" && <ManageComments />}
      </div>
    </div>
  );
};

export default AdminPanel;
