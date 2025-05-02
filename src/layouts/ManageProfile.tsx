import React, { useEffect } from "react";
import { User, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetUsuario, usePutUsuario } from "@/api/usuarioQuery";
import FeedbackDialog from "@/_components/FeedbackDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemeMyProfileUp } from "@/utils/validateForm";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { getUserData } from "@/hooks/AuthLocal";

const ManageProfile = () => {
  const usuario = getUserData();

  const formUserProfile = useForm({
    resolver: zodResolver(schemeMyProfileUp),
    defaultValues: {
      nome: "",
      sobrenome: "",
      email: "",
      senha: "",
    },
  });

  // Estados para controlar o diálogo de feedback
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState("");
  const [erro, setErro] = React.useState(null);

  // Buscar dados do usuário
  const { data: userData, isLoading } = useGetUsuario(usuario.usuario_id);
  console.log(userData);
  const { mutate: updateUser } = usePutUsuario();

  // Preencher o formulário quando os dados do usuário estiverem disponíveis
  useEffect(() => {
    if (userData) {
      formUserProfile.setValue("id", userData?.data[0]?.id);
      formUserProfile.setValue("nome", userData?.data[0]?.nome);
      formUserProfile.setValue("sobrenome", userData?.data[0]?.sobrenome);
      formUserProfile.setValue("email", userData?.data[0]?.email);
      formUserProfile.setValue("senha", userData?.data[0]?.senha);
      // Não preencher a senha por segurança
    }
  }, [userData, formUserProfile]);

  const handleSubmit = (data) => {
    if (!data.senha) {
      const { senha, ...dataWithoutPassword } = data;
      data = dataWithoutPassword;
    }

    updateUser(data, {
      onSuccess: () => {
        setIsSuccess(true);
        setFeedbackMessage("Seu perfil foi atualizado com sucesso!");
        setDialogOpen(true);
      },
      onError: (error) => {
        console.error(error);
        setErro(error);
        setIsSuccess(false);
        setFeedbackMessage(
          "Não foi possível atualizar o perfil. Verifique seus dados e tente novamente."
        );
        setDialogOpen(true);
      },
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <User className="mr-2" /> Meu Perfil
        </h1>
        <p className="text-gray-600 mt-1">
          Atualize suas informações pessoais abaixo
        </p>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Informações do Perfil</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...formUserProfile}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formUserProfile.handleSubmit(handleSubmit)(e);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormField
                    control={formUserProfile.control}
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
                    control={formUserProfile.control}
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
                    control={formUserProfile.control}
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
                    control={formUserProfile.control}
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
                            placeholder="Digite apenas se quiser alterar sua senha"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Campo oculto para o ID */}
                <FormField
                  control={formUserProfile.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

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

export default ManageProfile;
