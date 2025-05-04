import React, { useState, useRef } from "react";
import { Users, Edit, Save, Shield, Upload, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGetUsuarios,
  usePutUsuario,
  usePostUsuarios,
} from "@/api/usuarioQuery";
import FeedbackDialog from "@/_components/FeedbackDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemeUser, schemeUserUp } from "@/utils/validateForm";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

const ManageUsers = () => {
  const formUser = useForm({
    resolver: zodResolver(schemeUser),
    defaultValues: {
      nome: "",
      sobrenome: "",
      foto_perfil: null, // Changed to null instead of empty string
    },
  });

  const formUserUp = useForm({
    resolver: zodResolver(schemeUserUp),
    defaultValues: {
      nome: "",
      sobrenome: "",
      foto_perfil: null, // Changed to null instead of empty string
    },
  });

  const [activeTab, setActiveTab] = useState("cadastrar");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewImageUp, setPreviewImageUp] = useState("");
  const fileInputRef = useRef(null);
  const fileInputRefUp = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUp, setSelectedFileUp] = useState(null);

  // Dados da API
  const { data: usuariosData } = useGetUsuarios();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [erro, setErro] = useState(null);

  const { mutate: mutateUser } = usePostUsuarios();
  const { mutate: putUser } = usePutUsuario();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "cadastrar") {
      setModoEdicao(false);
      formUser.reset();
      setPreviewImage("");
      setSelectedFile(null);
    }
  };

  const handleImageChange = (e, isUpdate = false) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem.");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("A imagem deve ter menos de 5MB.");
        return;
      }

      if (isUpdate) {
        // Store the actual file object for later form submission
        setSelectedFileUp(file);
        formUserUp.setValue("foto_perfil", file);

        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setPreviewImageUp(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Store the actual file object for later form submission
        setSelectedFile(file);
        formUser.setValue("foto_perfil", file);

        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setPreviewImage(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  function submitUser(
    data: any,
    event: React.FormEvent<HTMLFormElement> | undefined
  ) {
    event?.preventDefault();

    // Create a FormData object to handle file uploads
    const formData = new FormData();

    // Add all fields to the FormData object
    Object.keys(data).forEach((key) => {
      // Special handling for file
      if (key === "foto_perfil" && data[key] instanceof File) {
        formData.append(key, data[key]);
      }
      // Skip foto_perfil if it's not a File (e.g., when it's a URL from the server)
      else if (
        key === "foto_perfil" &&
        !(data[key] instanceof File) &&
        !data[key]
      ) {
        // Do nothing - don't append null values for foto_perfil
      }
      // Handle all other fields
      else {
        formData.append(key, data[key]);
      }
    });

    console.log("Form data being sent:", Object.fromEntries(formData));

    if (modoEdicao) {
      putUser(formData, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("O usuário foi atualizado com sucesso!");
          setDialogOpen(true);
          formUserUp.reset();
          setPreviewImageUp("");
          setSelectedFileUp(null);
          setActiveTab("listar");
        },
        onError: (error) => {
          console.log(error);
          setErro(error);
          setIsSuccess(false);
          setFeedbackMessage(
            "Não foi possível atualizar o usuário. Verifique seus dados e tente novamente."
          );
          setDialogOpen(true);
          setModoEdicao(true);
          setActiveTab("cadastrar");
        },
      });
      setModoEdicao(false);
    } else {
      mutateUser(formData, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("O usuário foi cadastrado com sucesso!");
          setDialogOpen(true);
          formUser.reset();
          setPreviewImage("");
          setSelectedFile(null);
          setActiveTab("listar");
        },
        onError: (error) => {
          console.log(error);
          setErro(error);
          setIsSuccess(false);
          setFeedbackMessage(
            "Não foi possível cadastrar o usuário. Verifique seus dados e tente novamente."
          );
          setDialogOpen(true);
        },
      });
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const iniciarEdicao = (usuario) => {
    setModoEdicao(true);
    formUserUp.setValue("id", usuario.id);
    formUserUp.setValue("nome", usuario.nome);
    formUserUp.setValue("sobrenome", usuario.sobrenome);
    formUserUp.setValue("email", usuario.email);
    formUserUp.setValue("tipo", usuario.tipo);

    // Reset file selection
    setSelectedFileUp(null);

    // Se tiver uma foto de perfil, mostra a preview
    if (usuario.foto_perfil) {
      setPreviewImageUp(`http://localhost:3333${usuario.foto_perfil}`);
      // Don't set the foto_perfil field with the URL string
      // We'll only update it when a new file is selected
    } else {
      setPreviewImageUp("");
      formUserUp.setValue("foto_perfil", null);
    }

    setActiveTab("cadastrar");
  };

  // Tipos de usuário disponíveis
  const userTypes = [
    { id: "administrador", name: "Administrador" },
    { id: "professor", name: "Professor" },
    { id: "aluno", name: "Aluno" },
  ];

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <Users className="mr-2" /> Gerenciar Usuários
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
          {modoEdicao ? "Editar Usuário" : "Cadastrar Usuário"}
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "listar"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("listar")}
        >
          Usuários Cadastrados
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === "cadastrar" ? (
        <Card>
          <CardHeader className="p-4">
            <CardTitle>
              {modoEdicao ? "Editar Usuário" : "Cadastrar Novo Usuário"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {!modoEdicao ? (
              <Form {...formUser}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formUser.handleSubmit((data) => submitUser(data, e))();
                  }}
                  encType="multipart/form-data"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormField
                        control={formUser.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Nome
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
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
                        control={formUser.control}
                        name="sobrenome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Sobrenome
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormField
                        control={formUser.control}
                        name="foto_perfil"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Foto de Perfil
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-col items-center">
                                {/* Área de preview */}
                                {previewImage && (
                                  <div className="mb-2 border rounded-md p-2">
                                    <img
                                      src={previewImage}
                                      alt="Preview"
                                      className="w-32 h-32 object-cover rounded-full"
                                    />
                                  </div>
                                )}

                                {/* Input de arquivo oculto */}
                                <Input
                                  {...field}
                                  type="file"
                                  accept="image/*"
                                  ref={fileInputRef}
                                  onChange={(e) => handleImageChange(e)}
                                  className="hidden"
                                />

                                {/* Botão customizado para upload */}
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 w-full"
                                >
                                  <Upload size={16} className="mr-2" />
                                  {previewImage
                                    ? "Trocar imagem"
                                    : "Carregar imagem"}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={formUser.control}
                        name="tipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo de Usuário
                            </FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              >
                                <option value="">
                                  Selecione o tipo de usuário
                                </option>
                                {userTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={formUser.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormField
                        control={formUser.control}
                        name="senha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Senha
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
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
              <Form {...formUserUp}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formUserUp.handleSubmit((data) => submitUser(data, e))();
                  }}
                  encType="multipart/form-data"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormField
                        control={formUserUp.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Nome
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
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
                        control={formUserUp.control}
                        name="sobrenome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Sobrenome
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormField
                        control={formUserUp.control}
                        name="foto_perfil"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Foto de Perfil
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-col items-center">
                                {/* Área de preview */}
                                {previewImageUp && (
                                  <div className="mb-2 border rounded-md p-2">
                                    <img
                                      src={previewImageUp}
                                      alt="Preview"
                                      className="w-32 h-32 object-cover rounded-full"
                                    />
                                  </div>
                                )}

                                {/* Input de arquivo oculto */}
                                <Input
                                  {...field}
                                  type="file"
                                  accept="image/*"
                                  ref={fileInputRefUp}
                                  onChange={(e) => handleImageChange(e, true)}
                                  className="hidden"
                                />

                                {/* Botão customizado para upload */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    fileInputRefUp.current?.click()
                                  }
                                  className="flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 w-full"
                                >
                                  <Upload size={16} className="mr-2" />
                                  {previewImageUp
                                    ? "Trocar imagem"
                                    : "Carregar imagem"}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={formUserUp.control}
                        name="tipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo de Usuário
                            </FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              >
                                <option value="">
                                  Selecione o tipo de usuário
                                </option>
                                {userTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={formUserUp.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
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
                    control={formUserUp.control}
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
            <CardTitle>Usuários Cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Foto
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Nome
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Data de Cadastro
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuariosData?.map((usuario) => {
                    return (
                      <tr key={usuario.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {usuario.foto_perfil ? (
                            <img
                              src={`http://localhost:3333${usuario.foto_perfil}`}
                              alt={`${usuario.nome}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Image size={16} className="text-gray-500" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {usuario.nome} {usuario.sobrenome}
			</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {usuario.email}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className="flex items-center">
                            {usuario.tipo === "administrador" && (
                              <Shield size={14} className="mr-1" />
                            )}
                            {usuario.tipo}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {new Date(usuario.data_criacao).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          <button
                            onClick={() => {
                              iniciarEdicao(usuario);
                            }}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
    </div>
  );
};

export default ManageUsers;
