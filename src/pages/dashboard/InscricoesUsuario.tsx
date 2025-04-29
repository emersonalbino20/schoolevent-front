import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  User,
  MessageSquare,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useGetInscricoesUsuario } from "@/api/inscricaoQuery";
import { usePostComentarios } from "@/api/comentarioQuery";
import LOGO from "@/assets/images/logo.png";
import { getUserData } from "@/hooks/AuthLocal";

const InscricoesUsuario = () => {
  const usuario = getUserData();

  const navigate = useNavigate();
  useEffect(() => {
    usuario.tipo === "administrador" && navigate("*");
  }, []);
  // Buscar inscrições do usuário
  const {
    data: inscricoes,
    isLoading,
    error,
  } = useGetInscricoesUsuario(usuario.usuario_id);

  // Estado para gerenciar comentários
  const [comentarios, setComentarios] = useState({});
  const [comentarioStatus, setComentarioStatus] = useState({});

  // Hook para enviar comentários
  const { mutate: enviarComentario, isPending: enviandoComentario } =
    usePostComentarios();

  // Verificar se actividade já ocorreu
  const isEventoEncerrado = (dataFim) => {
    if (!dataFim) return false;
    const hoje = new Date();
    const fimEvento = new Date(dataFim);
    return fimEvento < hoje;
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

  // Manipular mudança no texto do comentário
  const handleComentarioChange = (actividadeId, texto) => {
    setComentarios({
      ...comentarios,
      [actividadeId]: texto,
    });
  };

  // Enviar comentário
  const handleEnviarComentario = (actividadeId) => {
    const comentarioData = {
      usuario_id: usuario.usuario_id,
      actividade_id: actividadeId,
      texto: comentarios[actividadeId] || "",
    };

    enviarComentario(comentarioData, {
      onSuccess: () => {
        setComentarioStatus({
          ...comentarioStatus,
          [actividadeId]: {
            success: true,
            error: false,
            message: "Comentário enviado com sucesso!",
          },
        });
        // Limpar o campo de comentário
        setComentarios({
          ...comentarios,
          [actividadeId]: "",
        });
      },
      onError: (err) => {
        setComentarioStatus({
          ...comentarioStatus,
          [actividadeId]: {
            success: false,
            error: true,
            message:
              err.message || "Erro ao enviar comentário. Tente novamente.",
          },
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
          Voltar
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Meus Actividades
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              <p className="text-green-600">Carregando suas inscrições...</p>
            </div>
          </div>
        ) : error ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">
              Erro ao carregar inscrições
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Não foi possível carregar suas inscrições. Por favor, tente
              novamente mais tarde.
            </AlertDescription>
          </Alert>
        ) : inscricoes.data?.length === 0 ? (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="text-blue-800">
              Nenhuma inscrição encontrada
            </AlertTitle>
            <AlertDescription className="text-blue-700">
              Você ainda não está inscrito em nenhum actividade. Explore os
              actividades disponíveis e inscreva-se!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {inscricoes.data?.map((inscricao) => (
              <Card key={inscricao.id} className="shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                      {inscricao.actividade.titulo}
                    </h2>
                    <div
                      className={`inline-flex ${
                        isEventoEncerrado(inscricao.actividade.data_fim)
                          ? "bg-gray-100 text-gray-800"
                          : "bg-green-100 text-green-800"
                      } rounded-full px-3 py-1 text-sm font-medium`}
                    >
                      {isEventoEncerrado(inscricao.actividade.data_fim)
                        ? "Evento Encerrado"
                        : "Evento Ativo"}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">
                    {inscricao.actividade.descricao}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Data</p>
                        <p>
                          De {formatDate(inscricao.actividade.data_inicio)} até{" "}
                          {formatDate(inscricao.actividade.data_fim)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Horário</p>
                        <p>
                          {formatTime(inscricao.actividade.data_inicio)} às{" "}
                          {formatTime(inscricao.actividade.data_fim)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Local</p>
                        <p>{inscricao.actividade.local}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <User className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Organizador</p>
                        <p>
                          {inscricao.actividade.criador.nome}{" "}
                          {inscricao.actividade.criador.sobrenome}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium">
                      Status:{" "}
                      {inscricao.status === "confirmado"
                        ? "Confirmado"
                        : inscricao.status}
                    </span>
                    <span className="text-sm">
                      Inscrito em: {formatDate(inscricao.data_inscricao)}
                    </span>
                  </div>
                </div>

                {isEventoEncerrado(inscricao.actividade.data_fim) && (
                  <CardFooter className="bg-gray-50 p-6 border-t flex flex-col">
                    <div className="w-full mb-4">
                      <p className="font-medium text-gray-700 mb-2 flex items-center">
                        <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
                        Deixe seu comentário sobre o actividade
                      </p>
                      <Textarea
                        placeholder="Compartilhe sua experiência ou feedback sobre este actividade..."
                        value={comentarios[inscricao.actividade.id] || ""}
                        onChange={(e) =>
                          handleComentarioChange(
                            inscricao.actividade.id,
                            e.target.value
                          )
                        }
                        className="mb-2"
                      />
                    </div>

                    {comentarioStatus[inscricao.actividade.id]?.success && (
                      <Alert className="mb-4 bg-green-50 border-green-200">
                        <Check className="h-5 w-5 text-green-600" />
                        <AlertDescription className="text-green-700">
                          {comentarioStatus[inscricao.actividade.id].message}
                        </AlertDescription>
                      </Alert>
                    )}

                    {comentarioStatus[inscricao.actividade.id]?.error && (
                      <Alert className="mb-4 bg-green-50 border-green-200">
                        <AlertDescription className="text-green-700">
                          {comentarioStatus[inscricao.actividade.id].message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6"
                      onClick={() =>
                        handleEnviarComentario(inscricao.actividade.id)
                      }
                      disabled={
                        !comentarios[inscricao.actividade.id] ||
                        enviandoComentario
                      }
                    >
                      {enviandoComentario ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Enviando...
                        </>
                      ) : (
                        "Enviar Comentário"
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default InscricoesUsuario;
