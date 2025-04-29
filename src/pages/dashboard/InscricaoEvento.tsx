import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  User,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetActividade } from "@/api/actividadeQuery";
import { usePostInscricao } from "@/api/inscricaoQuery";
import LOGO from "@/assets/images/logo.png";
import image from "@/assets/images/court-basketball.jpg";
import { getUserData } from "@/hooks/AuthLocal";

const InscricaoEvento = () => {
  const usuario = getUserData();
  useEffect(() => {
    usuario.tipo === "administrador" && navigate("*");
  }, []);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const { data: actividade, isLoading: isLoadingEvento } = useGetActividade(id);
  console.log(actividade);
  const r = actividade?.data[0]?.inscricoes?.some(
    (inscricao: any) => inscricao.usuario.email === usuario?.email
  );

  const { mutate: inscrever, isPending: isInscrevendo } = usePostInscricao();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inscricaoStatus, setInscricaoStatus] = useState({
    success: false,
    error: false,
    message: "",
  });

  // Atualizar índice da imagem quando o actividade carregar
  useEffect(() => {
    if (actividade?.data && actividade.data.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [actividade]);

  // Navegar para a próxima imagem
  const nextImage = () => {
    if (
      !actividade?.data ||
      actividade.data.length === 0 ||
      !actividade.data[0].imagens
    )
      return;

    const imagesCount = actividade.data[0].imagens.length;
    if (imagesCount <= 1) return;

    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesCount);
  };

  // Navegar para a imagem anterior
  const prevImage = () => {
    if (
      !actividade?.data ||
      actividade.data.length === 0 ||
      !actividade.data[0].imagens
    )
      return;

    const imagesCount = actividade.data[0].imagens.length;
    if (imagesCount <= 1) return;

    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + imagesCount) % imagesCount
    );
  };

  // Formatar data para exibição
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Formatar hora para exibição
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Verificar se actividade está aberto ou fechado
  const isEventoAberto = (dataFim) => {
    if (!dataFim) return false;
    const hoje = new Date();
    const fimEvento = new Date(dataFim);
    return fimEvento >= hoje;
  };

  // Realizar inscrição
  const handleInscricao = () => {
    if (!actividade) return;

    // Dados para inscrição
    const inscricaoData = {
      usuario_id: usuario.usuario_id,
      actividade_id: parseInt(id),
      data_inscricao: new Date().toISOString(),
      status: "confirmado",
    };

    inscrever(inscricaoData, {
      onSuccess: () => {
        setInscricaoStatus({
          success: true,
          error: false,
          message: "Inscrição realizada com sucesso!",
        });
      },
      onError: (err) => {
        setInscricaoStatus({
          success: false,
          error: true,
          message:
            err.message ||
            "Ocorreu um erro ao realizar a inscrição. Tente novamente.",
        });
      },
    });
  };

  // Voltar para a página anterior
  const handleVoltar = () => {
    navigate(-1);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3 text-lg sm:text-xl md:text-2xl font-bold text-green-600">
              <img
                src={LOGO}
                className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 object-contain"
                alt="Logo"
              />
              <span>RadlukActividades</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to={"/como-inscrever-se"}
                className="underline cursor-pointer text-blue-600 hover:text-blue-700"
              >
                Como Inscrever-se?
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="pt-24 px-4 md:px-6 container mx-auto max-w-screen-lg">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-gray-600 hover:text-green-600"
          onClick={handleVoltar}
        >
          <ArrowLeft className="mr-2" size={18} />
          Voltar para Actividades
        </Button>

        {isLoadingEvento ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              <p className="text-green-600">
                Carregando detalhes do actividade...
              </p>
            </div>
          </div>
        ) : actividade?.data.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-48 sm:h-64 md:h-80">
                {/* Carrossel de imagens */}
                {actividade.data[0].imagens &&
                actividade.data[0].imagens.length > 0 ? (
                  <>
                    <img
                      src={`http://localhost:3333${actividade.data[0].imagens[currentImageIndex]?.url}`}
                      alt={`${actividade.data[0].titulo} - Imagem ${
                        currentImageIndex + 1
                      }`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />

                    {/* Controles do carrossel */}
                    {actividade.data[0].imagens.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none transition-all duration-200"
                          aria-label="Imagem anterior"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none transition-all duration-200"
                          aria-label="Próxima imagem"
                        >
                          <ChevronRight size={20} />
                        </button>

                        {/* Indicadores de imagem */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                          {actividade.data[0].imagens.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`h-2 w-2 rounded-full focus:outline-none transition-all duration-200 ${
                                index === currentImageIndex
                                  ? "bg-white w-4"
                                  : "bg-white bg-opacity-50"
                              }`}
                              aria-label={`Ir para imagem ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <p className="text-gray-500">Imagem não disponível</p>
                  </div>
                )}

                {/* Overlay para actividade encerrado */}
                {!isEventoAberto(actividade.data[0]?.data_fim) && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-red-500 text-white px-6 py-3 rounded-md text-lg font-bold">
                      Evento Encerrado
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-0">
                    {actividade.data[0]?.titulo}
                  </h1>
                  {isEventoAberto(actividade.data[0]?.data_fim) && (
                    <div className="inline-flex bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
                      Inscrições Abertas
                    </div>
                  )}
                </div>

                <p className="text-lg text-gray-700 mb-6">
                  {actividade.data[0]?.descricao}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">Data</p>
                          <p>
                            De {formatDate(actividade.data[0]?.data_inicio)} até{" "}
                            {formatDate(actividade.data[0]?.data_fim)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">Horário</p>
                          <p>
                            {formatTime(actividade.data[0]?.data_inicio)} às{" "}
                            {formatTime(actividade.data[0]?.data_fim)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">Local</p>
                          <p>{actividade.data[0]?.local}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">
                            Organizador
                          </p>
                          <p>Administração escolar</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Status de inscrição */}
            {inscricaoStatus.success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <Check className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">
                  Inscrição confirmada!
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Sua inscrição para o actividade "{actividade.data[0]?.titulo}"
                  foi realizada com sucesso.
                </AlertDescription>
              </Alert>
            )}

            {inscricaoStatus.error && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <AlertTitle className="text-red-800">
                  Erro na inscrição
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  {inscricaoStatus.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Área de inscrição */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Realizar Inscrição
                </h2>
                <p className="text-gray-700 mb-6">
                  Para participar deste actividade, clique no botão abaixo para
                  confirmar sua inscrição. Após a inscrição, você receberá todas
                  as informações necessárias.
                </p>
              </CardContent>
              <CardFooter className="bg-gray-50 p-6 border-t">
                <Button
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6"
                  onClick={handleInscricao}
                  disabled={
                    !isEventoAberto(actividade.data[0]?.data_fim) ||
                    inscricaoStatus.success ||
                    isInscrevendo ||
                    actividade?.data[0]?.inscricoes?.some(
                      (inscricao: any) =>
                        inscricao.usuario.email === usuario?.email
                    )
                  }
                >
                  {isInscrevendo ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Processando...
                    </>
                  ) : inscricaoStatus.success ||
                    actividade?.data[0]?.inscricoes?.some(
                      (inscricao: any) =>
                        inscricao.usuario.email === usuario?.email
                    ) ? (
                    <>
                      <Check className="mr-2" size={18} />
                      Inscrito
                    </>
                  ) : !isEventoAberto(actividade.data[0]?.data_fim) ? (
                    "Inscrições Encerradas"
                  ) : (
                    "Confirmar Inscrição"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </>
        ) : (
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-red-800">
              Evento não encontrado
            </AlertTitle>
            <AlertDescription className="text-red-700">
              Não foi possível encontrar os detalhes deste actividade. Por
              favor, verifique o link e tente novamente.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  );
};

export default InscricaoEvento;
