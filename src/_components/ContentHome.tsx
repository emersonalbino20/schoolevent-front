import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  User,
  Calendar,
  MapPin,
  ChevronDown,
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
import LOGO from "@/assets/images/logo.png";
import { useGetActividades } from "@/api/actividadeQuery";
import { Link, useNavigate } from "react-router-dom";
import { clearUserData, getUserData } from "@/hooks/AuthLocal";

const ContentHome = () => {
  const { data: actividadesData, isLoading } = useGetActividades();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filteredActividades, setFilteredActividades] = useState([]);
  const [dateFilter, setDateFilter] = useState("todas");

  const navigate = useNavigate();
  const usuario = getUserData();
  function handleLogout() {
    clearUserData(navigate);
  }

  useEffect(() => {
    usuario.tipo === "administrador" && navigate("*");
  }, []);
  // Lidar com a busca e filtros
  useEffect(() => {
    if (actividadesData) {
      let filtered = [...actividadesData];

      // Aplicar filtro de pesquisa por título
      if (searchTerm) {
        filtered = filtered.filter((actividade) =>
          actividade.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Aplicar filtro de data
      if (dateFilter && dateFilter !== "todas") {
        filtered = filtered.filter(
          (actividade) => actividade.data_inicio === dateFilter
        );
      }

      setFilteredActividades(filtered);
    }
  }, [actividadesData, searchTerm, dateFilter]);

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

  // Verificar se actividade está aberto ou fechado
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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3">
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center space-x-3 text-lg sm:text-xl md:text-2xl font-bold text-green-600">
              <img
                src={LOGO}
                className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 object-contain"
                alt="Logo"
              />
              <span>RadlukActividades</span>
            </div>
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Buscar actividades..."
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg w-full"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Dropdown Menu - Desktop */}
              {usuario ? (
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-green-600 text-green-600"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Minha Conta
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem>
                        <Link to="/inscricao-usuario" className="w-full">
                          Minhas Inscrições
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/admin" className="w-full">
                          Painel Administrativo
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <a href="#" className="w-full">
                          Logout
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link to="/login" className="w-full">
                  <Button variant={"ghost"}>Login</Button>
                </Link>
              )}

              <p
                className="underline cursor-pointer text-blue-600 hover:text-blue-700"
                onClick={navigateToHowToRegister}
              >
                Como Inscrever-se?
              </p>
            </div>
          </div>

          {/* Search Bar Mobile */}
          <div className="pb-3 md:hidden">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar actividades..."
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 px-4 md:hidden">
          {usuario ? (
            <div className="space-y-4 py-12 text-lg">
              <div className="border-b pb-2">
                <h3 className="font-semibold mb-2">Minha Conta</h3>
                <div className="space-y-3 pl-2">
                  <Link
                    to="/inscricao-usuario"
                    className="block py-1 text-gray-700 hover:text-green-600"
                  >
                    Minhas Inscrições
                  </Link>
                  <Link
                    to="/admin"
                    className="block py-1 text-gray-700 hover:text-green-600"
                  >
                    Painel Administrativo
                  </Link>
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="block py-1 text-gray-700 hover:text-red-600"
                  >
                    Logout
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-12 text-lg">
              <div className="border-b pb-2">
                <div className="space-y-3 pl-2">
                  <Link
                    to={"/login"}
                    className="block py-1 text-gray-700 hover:text-green-600"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="pt-16 md:pt-24 px-4 md:px-6 container mx-auto max-w-screen-xl">
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
                        {actividadesData?.map((actividade) => (
                          <SelectItem
                            key={actividade?.id}
                            value={actividade?.data_inicio}
                          >
                            {formatDate(actividade?.data_inicio)} -{" "}
                            {formatDate(actividade?.data_fim)}
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

          {/* Seção de Actividades (à direita) */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                <p className="text-green-600">Carregando actividades...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              {/* Grade de Actividades */}
              {filteredActividades?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredActividades?.map((actividade) => {
                      const isAberto = isEventoAberto(actividade.data_fim);

                      return (
                        <Card
                          key={actividade.id}
                          className="overflow-hidden p-0 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                        >
                          <div className="relative">
                            <div className="h-48">
                              <img
                                src={`http://localhost:3333${actividade?.imagens[0]?.url}`}
                                alt={actividade.titulo}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Badge
                              className={`absolute top-2 right-2 ${
                                isAberto ? "bg-green-500" : "bg-green-500"
                              }`}
                            >
                              {isAberto ? "Aberto" : "Fechado"}
                            </Badge>
                          </div>

                          <CardContent className="p-4 flex-grow flex flex-col">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">
                              {actividade?.titulo}
                            </h3>

                            <div className="flex items-start space-x-1 text-sm text-gray-600 mb-2">
                              <Calendar
                                size={16}
                                className="flex-shrink-0 mt-0.5"
                              />
                              <span>
                                {formatDate(actividade?.data_inicio)} até{" "}
                                {formatDate(actividade?.data_fim)}
                              </span>
                            </div>

                            <div className="flex items-start space-x-1 text-sm text-gray-600 mb-3">
                              <MapPin
                                size={16}
                                className="flex-shrink-0 mt-0.5"
                              />
                              <span>{actividade?.local}</span>
                            </div>

                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                              {actividade?.descricao}
                            </p>
                          </CardContent>

                          <CardFooter className="p-4 pt-0">
                            <Link to={`/inscricao?id=${actividade?.id}`}>
                              <Button className="w-full bg-green-600 hover:bg-green-700">
                                Ver Detalhes
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
                    Nenhum actividade encontrado com os filtros selecionados.
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
