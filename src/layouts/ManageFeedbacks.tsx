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
import {
  useGetComentariosUsuario,
  usePostComentarios,
} from "@/api/comentarioQuery";
import { formatDate } from "@/utils/methods";
import { VscFeedback } from "react-icons/vsc";
import { FaRegCommentDots } from "react-icons/fa6";
import { getUserData } from "@/hooks/AuthLocal";
import { useGetFeedbacksUsuario } from "@/api/feedbackQuery";

const ManageFeedbacks = () => {
  // States for dialogs and feedback
  const usuario = getUserData();

  const {
    data: comentarioUsuario,
    isLoading,
    error,
  } = useGetComentariosUsuario(usuario.usuario_id);

  const { data: feedbackUsuario } = useGetFeedbacksUsuario(usuario.usuario_id);
  console.log(feedbackUsuario);

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <VscFeedback className="mr-2" /> FeedBacks em Actividades
        </h1>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Feedbacks Recebidos</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Carregando feedbacks...</p>
          ) : error ? (
            <p className="text-center text-green-500">
              Erro ao carregar feedbacks
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Actividade
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Pontuação
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Recebido por
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Comentado como
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedbackUsuario.data?.map((feedback) => {
                    return (
                      <tr key={feedback.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {feedback?.evento_titulo}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {feedback?.pontuacao}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {feedback?.professor_nome}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {feedback?.professor_email}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {feedback?.texto}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {formatDate(feedback?.data_criacao)}
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
    </div>
  );
};

export default ManageFeedbacks;
