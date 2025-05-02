import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  User,
  Calendar,
  MapPin,
  ChevronDown,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LOGO from "@/assets/images/logo.png";
import { useGetEventos, useGetEventosPasados } from "@/api/eventoQuery";
import { Link, useNavigate } from "react-router-dom";
import { clearUserData, getUserData } from "@/hooks/AuthLocal";

const ContentHome = () => {
  const { data: eventosData, isLoading: isLoadingEventos } = useGetEventos();
  const { data: eventosPasadosData, isLoading: isLoadingEventosPasados } = useGetEventosPasados();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [dateFilter, setDateFilter] = useState("todas");
  const [activeTab, setActiveTab] = useState("proximos");

  const navigate = useNavigate();
  const usuario = getUserData();

  useEffect(() => {
    if (usuario?.tipo == "administrador") {
      navigate('/admin');
    }
  }, []);

  function handleLogout() {
    clearUserData(navigate);
  }

  // Lidar com a busca e filtros
  useEffect(() => {
    const currentEventos = activeTab === "proximos" ? eventosData : eventosPasadosData;
    
    if (currentEventos) {
      let filtered = [...currentEventos];

      // Aplicar filtro de pesquisa por título
      if (searchTerm) {
        filtered = filtered.filter((evento) =>
          evento.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Aplicar filtro de data
      if (dateFilter && dateFilter !== "todas") {
        filtered = filtered.filter(
          (evento) => evento.data_inicio === dateFilter
        );
      }

      setFilteredEventos(filtered);
    }
  }, [eventosData, eventosPasadosData, searchTerm, dateFilter, activeTab]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateFilter = (value) => {
    setDateFilter(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("todas");
  };

  // Verificar se evento está aberto ou fechado
  const isEventoAberto = (dataFim) => {
    const hoje = new Date();
    const fimEvento = new Date(dataFim);
    return fimEvento >= hoje;
  };

  // Formatar data para exibição
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Navegar para a página Como Inscrever-se
  const navigateToHowToRegister = () => {
    navigate("/como-inscrever-se");
  };

  const isLoading = activeTab === "proximos" ? isLoadingEventos : isLoadingEventosPasados;
  const currentDates = activeTab === "proximos" ? eventosData : eventosPasadosData;

  return (
    <main className="bg-gray-50">
      {/* Conteúdo principal */}
      <div className="pt-16 md:pt-24 px-4 md:px-6 container mx-auto max-w-screen-xl">
        {/* Tabs para alternar entre eventos próximos e passados */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full md:w-auto grid grid-cols-2">
            <TabsTrigger value="proximos" className="px-8">
              <Calendar className="mr-2" size={16} />
              Próximos Eventos
            </TabsTrigger>
            <TabsTrigger value="pasados" className="px-8">
              <Clock className="mr-2" size={16} />
              Eventos Passados
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Layout principal - Formulário à esquerda e Produtos à direita */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Formulário de Filtro (à esquerda) */}
          <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <Card className="sticky top-24 shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-b pb-3 border-green-200">
                  <Calendar className="mr-2 text-green-600" size={20} />
                  Filtrar Actividades
                </h2>

                <div className="space-y-6">
                  {/* Campo de pesquisa */}
                  <div className="space-y-2">
                    <Label className="font-medium flex items-center">
                      Pesquisar
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Buscar por título"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border-green-200 pl-9"
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Filtro de Data */}
                  <div className="space-y-2">
                    <Label className="font-medium flex items-center">
                      Data
                    </Label>
                    <Select value={dateFilter} onValueChange={handleDateFilter}>
                      <SelectTrigger className="w-full border-green-200">
                        <SelectValue placeholder="Filtrar por data" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-50">
                        <SelectItem value="todas">Todas as datas</SelectItem>
                        {currentDates?.map((evento) => (
                          <SelectItem
                            key={evento?.id}
                            value={evento?.data_inicio}
                          >
                            {formatDate(evento?.data_inicio)} -{" "}
                            {formatDate(evento?.data_fim)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Botão para limpar filtros */}
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-green-600 text-green-600 hover:bg-green-50"
                    onClick={clearFilters}
                  >
                    Limpar filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Seção de Eventos (à direita) */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                <p className="text-green-600">Carregando eventos...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              {/* Grade de Eventos */}
              {filteredEventos?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredEventos?.map((evento) => {
                      const isAberto = isEventoAberto(evento.data_fim);
                      const statusLabel = activeTab === "proximos" 
                        ? (isAberto ? "Aberto" : "Fechado")
                        : "Encerrado";
                      const statusColor = activeTab === "proximos"
                        ? (isAberto ? "bg-green-500" : "bg-amber-500")
                        : "bg-gray-500";

                      return (
                        <Card
                          key={evento.id}
                          className="overflow-hidden p-0 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                        >
                          <div className="relative">
                            <div className="h-48">
                              <img
                                src={`http://localhost:3333${evento?.imagens[0]?.url}`}
                                alt={evento.titulo}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Badge
                              className={`absolute top-2 right-2 ${statusColor}`}
                            >
                              {statusLabel}
                            </Badge>
                          </div>

                          <CardContent className="p-4 flex-grow flex flex-col">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">
                              {evento?.titulo}
                            </h3>

                            <div className="flex items-start space-x-1 text-sm text-gray-600 mb-2">
                              <Calendar
                                size={16}
                                className="flex-shrink-0 mt-0.5"
                              />
                              <span>
                                {formatDate(evento?.data_inicio)} até{" "}
                                {formatDate(evento?.data_fim)}
                              </span>
                            </div>

                            <div className="flex items-start space-x-1 text-sm text-gray-600 mb-3">
                              <MapPin
                                size={16}
                                className="flex-shrink-0 mt-0.5"
                              />
                              <span>{evento?.local}</span>
                            </div>

                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                              {evento?.descricao}
                            </p>
                          </CardContent>

                          <CardFooter className="p-4 pt-0">
                            <Link to={`/inscricao?id=${evento?.id}`}>
                              <Button className="w-full bg-green-600 hover:bg-green-700">
                                {activeTab === "proximos" ? "Ver Detalhes" : "Ver Histórico"}
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <p className="text-lg text-gray-500">
                    Nenhum evento encontrado com os filtros selecionados.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-green-600 text-green-600 hover:bg-green-50"
                    onClick={clearFilters}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ContentHome;