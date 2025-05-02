import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import FeedbackDialog from "@/_components/FeedbackDialog";
import { useGetInscricoesUsuario } from "@/api/inscricaoQuery";
import { usePostComentarios } from "@/api/comentarioQuery";
import { formatDate, formatTime } from "@/utils/methods";
import { FaRegCommentDots } from "react-icons/fa6";
import { getUserData } from "@/hooks/AuthLocal";

const ManageComments = () => {
  // States for dialogs and feedback
  const usuario = getUserData();
  const {
    data: inscricoes,
    isLoading,
    error,
  } = useGetInscricoesUsuario(usuario.usuario_id);

  const [confirmDialogOpen, setComentarioDialogOpen] = useState(false);
  const [comentarioId, setReservationId] = useState(null);
  const [comentario, setComentario] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Open confirm comentario dialog
  const openComentarioDialog = (comentarioId) => {
    setReservationId(comentarioId);
    setComentarioDialogOpen(true);
    setComentario("");
  };

  const { mutate: enviarComentario } = usePostComentarios();

  const confirmReservation = () => {
    if (comentarioId) {
      enviarComentario(
        {
          usuario_id: usuario.usuario_id,
          evento_id: comentarioId,
          texto: comentario || "(Comentário Padrão): o evento estava ",
        },
        {
          onSuccess: () => {
            setIsSuccess(true);
            setFeedbackMessage("Comentário foi registado com sucesso!");
            setDialogOpen(true);
          },
          onError: (error) => {
            setIsSuccess(false);
            //setErro(error);
            setFeedbackMessage(
              "Não foi possível registar o seu comentário. Tente novamente."
            );
            setDialogOpen(true);
          },
        }
      );
    }
  };

  // Close feedback dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const isEventoEncerrado = (dataFim) => {
    if (!dataFim) return false;
    const hoje = new Date();
    const fimEvento = new Date(dataFim);
    return fimEvento < hoje;
  };

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <FaRegCommentDots className="mr-2" /> Comentar
        </h1>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Inscrições Realizadas</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Carregando reservas...</p>
          ) : error ? (
            <p className="text-center text-green-500">
              Erro ao carregar reservas
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Título
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Descrição
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Horário
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inscricoes.data?.map((inscricoes) => {
                    return (
                      <tr key={inscricoes.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {inscricoes?.evento.titulo}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {inscricoes?.evento.descricao}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          De {formatDate(inscricoes?.evento.data_inicio)} até{" "}
                          {formatDate(inscricoes?.evento.data_fim)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {formatTime(inscricoes?.evento.data_inicio)} às{" "}
                          {formatTime(inscricoes?.evento.data_fim)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          {isEventoEncerrado(inscricoes?.evento.data_fim) ? (
                            <button
                              onClick={() =>
                                openComentarioDialog(inscricoes?.id)
                              }
                              className="text-green-600 hover:text-green-800 flex items-center mr-2"
                            >
                              Comentar
                            </button>
                          ) : (
                            <button className="text-green-600 hover:text-green-800 flex items-center mr-2">
                              fechado
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <FeedbackDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
      />

      {/* Comentarioation Dialog for Reservation */}
      <AlertDialog
        open={confirmDialogOpen}
        onOpenChange={setComentarioDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Comentarioar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Informe o motivo da confirmação da reserva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <Textarea
              required
              placeholder="Deixe um comentário relacionado ao evento"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReservation}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Comentarioar Reserva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageComments;
