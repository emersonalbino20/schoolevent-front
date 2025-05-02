import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/hooks/AuthLocal";
import { MessageCircle, Send } from "lucide-react";

// Interfaces TypeScript
interface Usuario {
  nome: string;
  sobrenome: string;
  tipo: string;
  foto_perfil: string | null;
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
  evento: any; // Você pode definir uma interface mais específica para o evento se necessário
}

const ComentariosEvento: React.FC<ComentariosProps> = ({ evento }) => {
  const [comentario, setComentario] = useState("");
  const [isEnviando, setIsEnviando] = useState(false);
  const usuario = getUserData();
  
  // Extraindo todos os comentários do evento
  const comentarios: Comentario[] = evento?.comentarios?.map(comentario => ({
  ...comentario,
  usuario: {
    nome: comentario.usuario?.nome,
    sobrenome: comentario.usuario?.sobrenome,
    tipo: comentario.usuario?.tipo,
    foto_perfil: comentario.usuario?.foto_perfil
  }
})) || [];

  
  // Ordenar por data decrescente
  const comentariosOrdenados = [...comentarios].sort(
    (a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
  );

  // Função para formatar a data
  const formatarData = (dataString: string): string => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
  
  // Abreviação para iniciais do nome (para avatar fallback)
  const obterIniciais = (nome: string | undefined, sobrenome: string | undefined): string => {
    if (!nome || !sobrenome) return "?";
    const name = nome.split(" ").map(n => n[0]).join("").toUpperCase();
    const nick = sobrenome.split(" ").map(n => n[0]).join("").toUpperCase();
    return (name + nick);
  };
  console.log(comentariosOrdenados)

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
              <div key={comentario.id} className="flex gap-3 border-b border-gray-100 pb-4">
                {/* Avatar do usuário */}
                <div className="flex-shrink-0">
                  {comentario.usuario.foto_perfil ? (
                    <img 
                      src={`http://localhost:3333${comentario.usuario.foto_perfil}`} 
                      alt={`Avatar de ${comentario.usuario.nome} ${comentario.usuario.sobrenome}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">

            {/*comentariosOrdenados.map((c) => (
            obterIniciais(c.usuario.nome, c.usuario.sobrenome)))*/}
                    </div>
                  )}
                </div>
                
                {/* Conteúdo do comentário */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{comentario.usuario.nome}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {comentario.usuario.tipo === "aluno" ? "Aluno" : "Administrador"}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-1">{comentario.texto}</p>
                  <p className="text-xs text-gray-500">{formatarData(evento.data_criacao)}</p>
                </div>
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
            <div className="flex-shrink-0">
              {usuario.foto_perfil ? (
                <img 
                  src={`http://localhost:3333${usuario.foto_perfil}`} 
                  alt="Seu avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
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
            Faça <span className="text-green-600 font-medium">login</span> para deixar seu comentário.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default ComentariosEvento;