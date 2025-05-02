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
import { useGetEventos } from "@/api/eventoQuery";
import { Link, useNavigate } from "react-router-dom";
import { clearUserData, getUserData } from "@/hooks/AuthLocal";

const Header = () => {
  const { data: eventosData, isLoading } = useGetEventos();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [dateFilter, setDateFilter] = useState("todas");

  const navigate = useNavigate();
  const usuario = getUserData();

  
    useEffect(()=>{
      if(usuario?.tipo == "administrador"){
        navigate('/admin');
      }
  
    },[]);
    
  function handleLogout() {
    clearUserData(navigate);
  }

  // Lidar com a busca e filtros
  useEffect(() => {
    if (eventosData) {
      let filtered = [...eventosData];

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
  }, [eventosData, searchTerm, dateFilter]);

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

  return (
    <div className="bg-gray-50">
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
                  placeholder="Buscar eventos..."
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
                <Button variant={"ghost"}>Login</Button>
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
                placeholder="Buscar eventos..."
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
      </div>)}

      export default Header;