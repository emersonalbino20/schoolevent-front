import React, { useState, useRef } from "react";
import { Calendar, Edit, Trash2, Save, MapPin, Image, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetEventos,
  usePutEvento,
  usePostEventos,
  usePostImagensEvento,
} from "@/api/eventoQuery";
import FeedbackDialog from "@/_components/FeedbackDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemeEvento, schemeEventoUp } from "@/utils/validateForm";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getUserData } from "@/hooks/AuthLocal";

const ManageEvents = () => {
  const usuario = getUserData();
  const formEvento = useForm({
    resolver: zodResolver(schemeEvento),
    defaultValues: {
      titulo: "",
      descricao: "",
      local: "",
      data_inicio: "",
      data_fim: "",
    },
  });

  const formEventoUp = useForm({
    resolver: zodResolver(schemeEventoUp),
    defaultValues: {
      titulo: "",
      descricao: "",
      local: "",
      data_inicio: "",
      data_fim: "",
      criado_por: 1,
    },
  });

  const [activeTab, setActiveTab] = useState("cadastrar");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  // Estado para o diálogo de visualização de imagens
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentEventImages, setCurrentEventImages] = useState([]);
  const [currentEventTitle, setCurrentEventTitle] = useState("");

  // Dados da API
  const { data: eventosData } = useGetEventos();
  // Estados para controlar o diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [erro, setErro] = useState(null);

  // Estados para o diálogo de confirmação de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventoParaExcluir, setEventoParaExcluir] = useState(null);

  const { mutate: mutateEvento } = usePostEventos();
  const { mutate: putEvento } = usePutEvento();
  const { mutate: postImagens } = usePostImagensEvento();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "cadastrar") {
      setModoEdicao(false);
      formEvento.reset();
      setSelectedFiles([]);
      setPreviewImages([]);
    }
  };

  // Função para abrir o diálogo de confirmação
  const openDeleteDialog = (evento) => {
    setEventoParaExcluir(evento);
    setDeleteDialogOpen(true);
  };

  // Função para confirmar a exclusão
  const confirmDelete = () => {
    if (eventoParaExcluir) {
      // Implementar exclusão aqui quando necessário
      //handleSubmitPatchEvento(eventoParaExcluir.id);
    }
    setDeleteDialogOpen(false);
  };

  // Formatar data para input datetime-local
  const formatarDataParaInput = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toISOString().slice(0, 16);
  };

  // Função para mostrar imagens do evento
  const showEventImages = (evento) => {
    setCurrentEventImages(evento.imagens || []);
    setCurrentEventTitle(evento.titulo);
    setImageDialogOpen(true);
  };

  // Manipulador de seleção de arquivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);

    // Criar previews para os arquivos selecionados
    const newPreviews = files.map((file: any) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  // Remover arquivo selecionado
  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]); // Limpar URL do objeto
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  // Enviar imagens após o cadastro do evento
  const uploadImages = (eventoId) => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append("imagens", file);
      formData.append("descricoes", `Imagem ${index + 1} do evento`);
    });
    formData.append("evento_id", eventoId);
    postImagens(formData, {
      onSuccess: (response) => {
        console.log(formData);
        setIsSuccess(true);
        setFeedbackMessage("Imagens enviadas com sucesso!");
        setSelectedFiles([]);
        setPreviewImages([]);
      },
      onError: (error) => {
        console.error("Erro ao enviar imagens:", error);
        setIsSuccess(false);
        setFeedbackMessage("Erro ao enviar as imagens. Tente novamente.");
        setDialogOpen(true);
      },
    });
  };

  const [criador_info, setCriador_info] = useState(null);
  function submitEvento(
    data: any,
    event: React.FormEvent<HTMLFormElement> | undefined
  ) {
    event?.preventDefault();
    if (modoEdicao) {
      console.log(criador_info?.inscricoes?.length);
      if (criador_info?.criador?.email !== usuario?.email) {
        setErro({
          response: {
            data: {
              erro: `Actividade criada pelo(a) sr(a). 
          ${criador_info?.criador?.nome} ${criador_info?.criador?.sobrenome}, contacte o criador para o editar o evento 
          ${criador_info?.criador?.email}`,
            },
          },
        });
        setIsSuccess(false);
        setFeedbackMessage("Acesso Negado.");
        setDialogOpen(true);
      } else if (criador_info?.inscricoes?.length > 0) {
        setErro({
          response: {
            data: {
              erro: `A Actividade já possui ${criador_info?.inscricoes?.length} usuários inscritos, os 
          dados já não podem ser editados`,
            },
          },
        });
        setIsSuccess(false);
        setFeedbackMessage("Edição Não Permitidade.");
        setDialogOpen(true);
      } else {
        putEvento(data, {
          onSuccess: (response) => {
            setIsSuccess(true);
            setFeedbackMessage("O evento foi atualizado com sucesso!");
            setDialogOpen(true);
            formEventoUp.reset();
            setActiveTab("listar");
          },
          onError: (error) => {
            setErro(error);
            setIsSuccess(false);
            setFeedbackMessage(
              "Não foi possível atualizar o evento. Verifique seus dados e tente novamente."
            );
            setDialogOpen(true);
            setModoEdicao(true);
            setActiveTab("cadastrar");
          },
        });
        setModoEdicao(false);
      }
    } else {
      mutateEvento(
        {
          titulo: data.titulo,
          descricao: data.descricao,
          data_inicio: data.data_inicio,
          data_fim: data.data_fim,
          local: data.local,
          criado_por: usuario?.usuario_id,
        },
        {
          onSuccess: (response) => {
            setIsSuccess(true);
            setFeedbackMessage("O evento foi cadastrado com sucesso!");
            setDialogOpen(true);

            // Obter o ID do evento recém-criado e enviar as imagens
            const eventoId =
              response.data?.id || eventosData?.[eventosData.length - 1]?.id;
            if (eventoId && selectedFiles.length > 0) {
              uploadImages(eventoId);
            }

            formEvento.reset();
            setActiveTab("listar");
          },
          onError: (error) => {
            setErro(error);
            setIsSuccess(false);
            setFeedbackMessage(
              "Não foi possível cadastrar o evento. Verifique seus dados e tente novamente."
            );
            setDialogOpen(true);
          },
        }
      );
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const iniciarEdicao = (evento) => {
    setModoEdicao(true);
    setCriador_info(evento);
    formEventoUp.setValue("id", evento.id);
    formEventoUp.setValue("titulo", evento.titulo);
    formEventoUp.setValue("descricao", evento.descricao);
    formEventoUp.setValue("local", evento.local);
    formEventoUp.setValue(
      "data_inicio",
      formatarDataParaInput(evento.data_inicio)
    );
    formEventoUp.setValue("data_fim", formatarDataParaInput(evento.data_fim));
    setActiveTab("cadastrar");

    // Limpar imagens previamente selecionadas
    setSelectedFiles([]);
    setPreviewImages([]);
  };

  // Função para formatar data para exibição
  const formatarData = (data) => {
    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-2" /> Gerenciar Actividades Escolares
        </h1>
      </div>

      {/* Abas */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "cadastrar"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("cadastrar")}
        >
          {modoEdicao ? "Editar Actividade" : "Cadastrar Actividade"}
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "listar"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("listar")}
        >
          Actividades Cadastrados
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === "cadastrar" ? (
        <Card>
          <CardHeader className="p-4">
            <CardTitle>
              {modoEdicao ? "Editar Actividade" : "Cadastrar Nova Actividade"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {!modoEdicao ? (
              <Form {...formEvento}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formEvento.handleSubmit((data) => submitEvento(data, e))();
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={formEvento.control}
                        name="titulo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Título da Actividade
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Ex: Olimpíadas Escolares 2025"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <FormField
                        control={formEvento.control}
                        name="descricao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Descrição
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                                placeholder="Descreva detalhes sobre a actividade"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormField
                        control={formEvento.control}
                        name="local"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Local
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Ex: Auditório Principal, Quadra Poliesportiva"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={formEvento.control}
                        name="data_inicio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Data e Hora de Início
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="datetime-local"
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={formEvento.control}
                        name="data_fim"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Data e Hora de Término
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="datetime-local"
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Área de upload de imagens - mostrada apenas em modo cadastro */}
                  <div className="mt-6 md:col-span-2">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagens do Evento
                    </Label>

                    <div className="mt-2 flex items-center">
                      <div
                        className="p-2 border border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Image size={20} className="mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Clique para adicionar imagens
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Preview de imagens */}
                    {previewImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-700 mb-2">
                          {previewImages.length} imagem(ns) selecionada(s)
                        </p>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {previewImages.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-0 right-0 bg-green-500 text-white p-1 rounded-full w-5 h-5 flex items-center justify-center"
                                title="Remover imagem"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Save size={16} className="inline mr-1" />
                      Cadastrar
                    </button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...formEventoUp}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formEventoUp.handleSubmit((data) =>
                      submitEvento(data, e)
                    )();
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={formEventoUp.control}
                        name="titulo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Título da Actividade
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Ex: Olimpíadas Escolares 2025"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormField
                        control={formEventoUp.control}
                        name="descricao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Descrição
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                                placeholder="Descreva detalhes sobre o evento"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormField
                        control={formEventoUp.control}
                        name="local"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Local
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Ex: Auditório Principal, Quadra Poliesportiva"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={formEventoUp.control}
                        name="data_inicio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Data e Hora de Início
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="datetime-local"
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={formEventoUp.control}
                        name="data_fim"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Data e Hora de Término
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="datetime-local"
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={formEventoUp.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="hidden"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Nota sobre imagens em modo edição */}
                  <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
                    <p className="text-sm flex items-center">
                      <Image size={16} className="mr-2" />
                      As imagens não podem ser alteradas durante a edição do
                      evento.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Save size={16} className="inline mr-1" />
                      Atualizar
                    </button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      ) : activeTab === "listar" ? (
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Actividades Cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Título
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Local
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Criado Por
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Início
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Término
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                      Imagens
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eventosData?.map((evento) => (
                    <tr key={evento.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {evento.titulo}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {evento.local}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {evento?.criador?.nome} {evento?.criador?.sobrenome} (
                        {evento?.criador?.tipo})
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatarData(evento.data_inicio)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatarData(evento.data_fim)}
                      </td>

                      <td className="px-4 py-2 whitespace-nowrap text-center">
                        <button
                          onClick={() => showEventImages(evento)}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                          title="Ver imagens"
                        >
                          <Image size={16} className="mr-1" />
                          {evento.imagens?.length || 0}
                        </button>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <button
                          onClick={() => iniciarEdicao(evento)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          title="Editar evento"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Feedback Dialog */}
      <FeedbackDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
        errorData={erro}
      />

      {/* Confirmation Dialog for Delete */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o evento "
              {eventoParaExcluir?.titulo?.substring(0, 20)}..."? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para mostrar as imagens do evento */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Imagens da Actidade: {currentEventTitle}</DialogTitle>
            <DialogDescription>
              {currentEventImages.length > 0
                ? `Exibindo ${currentEventImages.length} imagens`
                : "Este evento não possui imagens cadastradas"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentEventImages.length > 0 ? (
              <div
                className={`grid gap-4 ${
                  currentEventImages.length > 1
                    ? "grid-cols-2 md:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {currentEventImages.map((imagem, index) => (
                  <div
                    key={index}
                    className="relative rounded-md overflow-hidden"
                  >
                    <img
                      src={`http://localhost:3333${imagem.url}`}
                      alt={`Imagem ${index + 1} do evento ${currentEventTitle}`}
                      className={`w-full h-auto object-cover rounded-md ${
                        currentEventImages.length > 1
                          ? "max-h-40 md:max-h-52"
                          : "max-h-96"
                      }`}
                    />
                    {/*<div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-50 text-white p-2 text-sm">
                      Imagem {index + 1} • Ordem: {imagem.ordem || "N/A"}
                    </div>*/}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <Image size={48} className="mb-2 opacity-50" />
                <p>Nenhuma imagem encontrada para este evento</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Fechar
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageEvents;
