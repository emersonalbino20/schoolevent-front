import React from "react";
import { Star, StarHalf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AlunosDestacados = ({ alunosDestacados }) => {
  // Verifica se existem alunos destacados
  if (!alunosDestacados || alunosDestacados.length === 0) {
    return null;
  }

  // Função para renderizar estrelas baseado na pontuação (1-5)
  const renderEstrelas = (pontuacao) => {
    const estrelas = [];
    const pontuacaoInt = Math.floor(pontuacao);
    const temMeiaEstrela = pontuacao - pontuacaoInt >= 0.5;

    // Adiciona estrelas cheias
    for (let i = 0; i < pontuacaoInt; i++) {
      estrelas.push(
        <Star
          key={`estrela-cheia-${i}`}
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    // Adiciona meia estrela se aplicável
    if (temMeiaEstrela) {
      estrelas.push(
        <StarHalf
          key="estrela-meia"
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    // Adiciona estrelas vazias
    const estrelasVazias = 5 - Math.ceil(pontuacao);
    for (let i = 0; i < estrelasVazias; i++) {
      estrelas.push(
        <Star
          key={`estrela-vazia-${i}`}
          className="w-5 h-5 text-yellow-400"
        />
      );
    }

    return estrelas;
  };

  // Formata a data para exibição
  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Alunos Destacados</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {alunosDestacados.map((aluno) => (
          <Card key={aluno.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-white">
                    {aluno.foto_perfil ? (
                      <img
                        src={`http://localhost:3333${aluno.foto_perfil}`}
                        alt={`${aluno.nome} ${aluno.sobrenome}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {aluno.nome.charAt(0)}
                        {aluno.sobrenome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {aluno.nome} {aluno.sobrenome}
                    </h3>
                    <p className="text-green-100 text-sm">{aluno.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {aluno.feedbacks_recebidos && aluno.feedbacks_recebidos.map((feedback) => (
                  <div key={feedback.id} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <p className="font-medium text-gray-900 mr-2">
                          Avaliação do(a) Prof. {feedback.professor.nome} {feedback.professor.sobrenome}:
                        </p>
                        <div className="flex">
                          {renderEstrelas(feedback.pontuacao)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{feedback.texto}</p>
                    <p className="text-xs text-gray-500">
                      Avaliado em: {formatarData(feedback.data_criacao)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlunosDestacados;
