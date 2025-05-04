import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/hooks/AuthLocal";
import { MessageCircle, Send, X, Mail, User, UserCircle, MoreVertical, Star } from "lucide-react";

// Interfaces TypeScript
interface Usuario {
  id?: number;
  nome: string;
  sobrenome: string;
  tipo: string;
  foto_perfil: string | null;
  email?: string;
}

interface Comentario {
  id: number;
  usuario_id: number;
  evento_id: number;
  texto: string;
  data_criacao: string;
  data_atualizacao: string | null;
  usuario: Usuario;
}

interface ComentariosProps {
  evento: any;
}

interface FeedbackForm {
  professor_id: number;
  aluno_id: number;
  evento_id: number;
  texto: string;
  pontuacao: number;
}

// Componente Modal de Usuário
const UserModal = ({ usuario, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho do modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Perfil do Usuário</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Conteúdo do modal */}
        <div className="p-6 flex flex-col items-center">
          {/* Imagem grande do usuário */}
          <div className="mb-6">
            {usuario.foto_perfil ? (
              <img
                src={`http://localhost:3333${usuario.foto_perfil}`}
                alt={`Avatar de ${usuario.nome} ${usuario.sobrenome}`}
                className="h-48 w-48 rounded-full object-cover border-4 border-green-100"
              />
            ) : (
              <div className="h-48 w-48 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-4xl font-bold">
                {obterIniciais(usuario.nome, usuario.sobrenome)}
              </div>
            )}
          </div>
          
          {/* Informações do usuário */}
          <div className="w-full space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Nome Completo</p>
                <p className="font-medium">{usuario.nome} {usuario.sobrenome}</p>
              </div>
            </div>
            
            {usuario.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-green-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{usuario.email}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <UserCircle className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-medium">{usuario.tipo}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rodapé do modal */}
        <div className="border-t p-4 flex justify-end">
          <Button 
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Componente de Modal de Feedback
const FeedbackModal = ({ aluno, evento, isOpen, onClose }) => {
  const usuario = getUserData();
  const [feedback, setFeedback] = useState({
    professor_id: usuario?.id || 0,
    aluno_id: aluno?.id || 0,
    evento_id: evento?.id || 0,
    texto: "",
    pontuacao: 0
  });
  const [isEnviando, setIsEnviando] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const handleStarClick = (rating) => {
    setFeedback({ ...feedback, pontuacao: rating });
  };

  const handleSubmit = async () => {
    if (!feedback.texto.trim() || feedback.pontuacao === 0) return;

    setIsEnviando(true);

    try {
      // Aqui você implementaria a lógica de envio para a API
      // Por exemplo: await api.post('/feedbacks', feedback);

      // Simulando sucesso após envio
      setTimeout(() => {
        setIsEnviando(false);
        onClose();
        // Aqui você poderia mostrar uma notificação de sucesso
      }, 1000);
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      setIsEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Cabeçalho do modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Feedback para Aluno</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Conteúdo do modal */}
        <div className="p-6">
          {/* Informações do aluno */}
          <div className="flex items-center gap-3 mb-6">
            {aluno.foto_perfil ? (
              <img
                src={`http://localhost:3333${aluno.foto_perfil}`}
                alt={`Avatar de ${aluno.nome} ${aluno.sobrenome}`}
                className="h-14 w-14 rounded-full object-cover border-2 border-green-100"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                {obterIniciais(aluno.nome, aluno.sobrenome)}
              </div>
            )}
            <div>
              <h4 className="font-medium text-lg">{aluno.nome} {aluno.sobrenome}</h4>
              <p className="text-sm text-gray-500">Aluno</p>
            </div>
          </div>
          
          {/* Formulário de feedback */}
          <div className="space-y-4">
            {/* Campo de avaliação em estrelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avaliação
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={28}
                      className={`${
                        (hoverRating ? star <= hoverRating : star <= feedback.pontuacao)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {feedback.pontuacao > 0 ? `${feedback.pontuacao} de 5 estrelas` : "Selecione uma avaliação"}
                </span>
              </div>
            </div>

            {/* Campo de texto do feedback */}
            <div>
              <label htmlFor="feedback-text" className="block text-sm font-medium text-gray-700 mb-2">
                Comentário
              </label>
              <textarea
                id="feedback-text"
                rows={4}
                placeholder="Descreva aqui seu feedback para o aluno..."
                className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                value={feedback.texto}
                onChange={(e) => setFeedback({ ...feedback, texto: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        {/* Rodapé do modal */}
        <div className="border-t p-4 flex justify-end gap-2">
          <Button 
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            disabled={isEnviando}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!feedback.texto.trim() || feedback.pontuacao === 0 || isEnviando}
          >
            {isEnviando ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              "Enviar Feedback"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Componente para menu de opções
const OptionsMenu = ({ isOpen, onClose, onFeedback }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md py-1 z-10 w-48">
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
        onClick={onFeedback}
      >
        <Star size={16} className="text-green-600" />
        <span>Dar feedback ao aluno</span>
      </button>
    </div>
  );
};

// Abreviação para iniciais do nome (para avatar fallback)
const obterIniciais = (
  nome: string | undefined,
  sobrenome: string | undefined
): string => {
  if (!nome || !sobrenome) return "?";
  const name = nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const nick = sobrenome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return name + nick;
};

const ComentariosEvento: React.FC<ComentariosProps> = ({ evento }) => {
  const [comentario, setComentario] = useState("");
  const [isEnviando, setIsEnviando] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [selectedAluno, setSelectedAluno] = useState<Usuario | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const usuario = getUserData();

  // Extraindo todos os comentários do evento
  const comentarios: Comentario[] =
    evento?.comentarios?.map((comentario) => ({
      ...comentario,
      usuario: {
        id: comentario.usuario_id,
        nome: comentario.usuario?.nome,
        sobrenome: comentario.usuario?.sobrenome,
        tipo: comentario.usuario?.tipo,
        foto_perfil: comentario.usuario?.foto_perfil,
        email: comentario.usuario?.email,
      },
    })) || [];

  // Ordenar por data decrescente
  const comentariosOrdenados = [...comentarios].sort(
    (a, b) =>
      new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
  );

  // Função para formatar a data
  const formatarData = (dataString: string): string => {
    const data = new Date(dataString);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Função para enviar novo comentário
  const enviarComentario = async () => {
    if (!comentario.trim() || !usuario) return;

    setIsEnviando(true);

    try {
      // Aqui você implementaria a lógica de envio para a API
      // Por exemplo: await api.post('/comentarios', { texto: comentario, evento_id: evento.id });

      // Simulando sucesso após envio
      setTimeout(() => {
        setComentario("");
        setIsEnviando(false);
        // Aqui você poderia recarregar os comentários ou atualizar o estado local
      }, 1000);
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      setIsEnviando(false);
    }
  };

  // Função para abrir o modal com os detalhes do usuário
  const abrirModalUsuario = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setUserModalOpen(true);
  };

  // Função para abrir o modal de feedback
  const abrirModalFeedback = (aluno: Usuario) => {
    setSelectedAluno(aluno);
    setFeedbackModalOpen(true);
    setOpenMenuId(null); // Fecha o menu de opções
  };

  // Função para alternar o menu de opções
  const toggleOptionsMenu = (comentarioId: number) => {
    setOpenMenuId(openMenuId === comentarioId ? null : comentarioId);
  };

  // Verificar se o usuário atual é professor
  const isProfessor = usuario?.tipo === "professor";

  return (
    <Card className="shadow-md mt-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Comentários ({comentariosOrdenados.length})
          </h2>
        </div>

        {/* Lista de comentários */}
        {comentariosOrdenados.length > 0 ? (
          <div className="space-y-4">
            {comentariosOrdenados.map((comentario) => (
              <div
                key={comentario.id}
                className="flex gap-3 border-b border-gray-100 pb-4 relative"
              >
                {/* Avatar do usuário com clique para abrir modal */}
                <div className="flex-shrink-0">
                  <div 
                    onClick={() => abrirModalUsuario(comentario.usuario)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    title="Clique para ver detalhes do usuário"
                  >
                    {comentario.usuario.foto_perfil ? (
                      <img
                        src={`http://localhost:3333${comentario.usuario.foto_perfil}`}
                        alt={`Avatar de ${comentario.usuario.nome} ${comentario.usuario.sobrenome}`}
                        className="h-10 w-10 rounded-full object-cover border-2 border-transparent hover:border-green-500"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium border-2 border-transparent hover:border-green-500">
                        {obterIniciais(comentario.usuario.nome, comentario.usuario.sobrenome)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Conteúdo do comentário */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="font-medium text-gray-900 cursor-pointer hover:text-green-600"
                      onClick={() => abrirModalUsuario(comentario.usuario)}
                    >
                      {comentario.usuario.nome} {comentario.usuario.sobrenome}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {comentario.usuario.tipo}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-1">{comentario.texto}</p>
                  <p className="text-xs text-gray-500">
                    {formatarData(comentario.data_criacao)}
                  </p>
                </div>

                {/* Botão de opções (apenas para professores vendo comentários de alunos) */}
                {isProfessor && comentario.usuario.tipo === "aluno" && (
                  <div className="relative">
                    <button
                      className="p-1 rounded-full hover:bg-gray-100"
                      onClick={() => toggleOptionsMenu(comentario.id)}
                      aria-label="Opções de feedback"
                    >
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
                    <OptionsMenu
                      isOpen={openMenuId === comentario.id}
                      onClose={() => setOpenMenuId(null)}
                      onFeedback={() => abrirModalFeedback(comentario.usuario)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Ainda não há comentários para este evento.</p>
            <p className="text-sm">Seja o primeiro a comentar!</p>
          </div>
        )}
      </CardContent>

      {/* Formulário para adicionar comentário */}
      {usuario && (
        <CardFooter className="p-6 border-t bg-gray-50">
          <div className="flex w-full items-center gap-3">
            {/* Avatar do usuário atual */}
            <div 
              className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => usuario && abrirModalUsuario(usuario)}
              title="Clique para ver seu perfil"
            >
              {usuario.foto_perfil ? (
                <img
                  src={`http://localhost:3333${usuario.foto_perfil}`}
                  alt="Seu avatar"
                  className="h-10 w-10 rounded-full object-cover border-2 border-transparent hover:border-green-500"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium border-2 border-transparent hover:border-green-500">
                  {obterIniciais(usuario.nome, usuario.sobrenome)}
                </div>
              )}
            </div>

            {/* Campo de entrada de texto */}
            <div className="flex-1 relative">
              <textarea
                placeholder="Deixe seu comentário sobre o evento..."
                className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={2}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                disabled={isEnviando}
              />

              {/* Botão de enviar */}
              <Button
                className="absolute right-2 bottom-2 bg-green-600 hover:bg-green-700 text-white p-2 h-8 w-8"
                onClick={enviarComentario}
                disabled={!comentario.trim() || isEnviando}
              >
                {isEnviando ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Send size={16} />
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      )}

      {/* Mensagem para usuários não logados */}
      {!usuario && (
        <CardFooter className="p-6 border-t bg-gray-50 text-center">
          <p className="text-gray-600">
            Faça <span className="text-green-600 font-medium">login</span> para
            deixar seu comentário.
          </p>
        </CardFooter>
      )}

      {/* Modal de detalhes do usuário */}
      {selectedUser && (
        <UserModal 
          usuario={selectedUser} 
          isOpen={userModalOpen} 
          onClose={() => setUserModalOpen(false)} 
        />
      )}

      {/* Modal de feedback para aluno */}
      {selectedAluno && (
        <FeedbackModal
          aluno={selectedAluno}
          evento={evento}
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
        />
      )}
    </Card>
  );
};

export default ComentariosEvento;
