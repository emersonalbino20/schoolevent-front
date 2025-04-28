import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LOGO from "@/assets/images/logo.png";
import {
  UserCircle,
  CalendarCheck,
  ClipboardList,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const ComoInscrever = () => {
  return (
    <main className="min-h-screen bg-gray-50 pt-6">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header com navegação de volta */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5 text-green-600" />
            <span className="text-green-600 font-medium">
              Voltar para eventos
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            <img
              src={LOGO}
              className="h-10 w-10 object-contain"
              alt="Logo RadlukEventos"
            />
            <span className="text-xl font-bold text-green-600">
              RadlukEventos
            </span>
          </div>
        </div>

        {/* Título da página */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Como Inscrever-se nos Eventos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Siga este guia simples de 4 passos para participar de todos os
            eventos disponíveis em nossa plataforma
          </p>
        </div>

        {/* Passos de inscrição */}
        <div className="space-y-8 mb-12">
          {/* Passo 1 */}
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center justify-center bg-blue-100 rounded-full p-4 h-16 w-16 flex-shrink-0">
                  <UserCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2">
                    <span className="flex items-center justify-center bg-blue-500 text-white rounded-full h-6 w-6 text-sm">
                      1
                    </span>
                    Crie sua conta
                  </h2>
                  <p className="text-gray-700">
                    Para começar, você precisa ter uma conta na plataforma
                    RadlukEventos. Registre-se fornecendo algumas informações
                    básicas como nome, e-mail e senha. Sua conta permitirá
                    acompanhar inscrições, receber notificações e gerenciar seu
                    perfil.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Rápido e fácil
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Dados seguros
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passo 2 */}
          <Card className="overflow-hidden border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center justify-center bg-purple-100 rounded-full p-4 h-16 w-16 flex-shrink-0">
                  <CalendarCheck className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2">
                    <span className="flex items-center justify-center bg-purple-500 text-white rounded-full h-6 w-6 text-sm">
                      2
                    </span>
                    Selecione um evento
                  </h2>
                  <p className="text-gray-700">
                    Navegue pelo catálogo de eventos disponíveis e escolha o que
                    mais lhe interessa. Você pode filtrar por data, localização
                    ou tema. Clique em "Ver Detalhes" para obter mais
                    informações sobre o evento, como descrição completa, agenda,
                    local e requisitos.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Filtragem avançada
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Detalhes completos
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passo 3 */}
          <Card className="overflow-hidden border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center justify-center bg-green-100 rounded-full p-4 h-16 w-16 flex-shrink-0">
                  <ClipboardList className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2">
                    <span className="flex items-center justify-center bg-green-500 text-white rounded-full h-6 w-6 text-sm">
                      3
                    </span>
                    Inscreva-se
                  </h2>
                  <p className="text-gray-700">
                    Na página de detalhes do evento, clique no botão
                    "Inscrever-se". Preencha o formulário com as informações
                    solicitadas e confirme sua inscrição. Em caso de eventos
                    pagos, você será direcionado para o processo de pagamento.
                    Após a confirmação, você receberá um e-mail com todos os
                    detalhes da sua inscrição.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Processo simplificado
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Confirmação por e-mail
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passo 4 */}
          <Card className="overflow-hidden border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center justify-center bg-amber-100 rounded-full p-4 h-16 w-16 flex-shrink-0">
                  <MessageSquare className="h-8 w-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2">
                    <span className="flex items-center justify-center bg-amber-500 text-white rounded-full h-6 w-6 text-sm">
                      4
                    </span>
                    Deixe seu feedback
                  </h2>
                  <p className="text-gray-700">
                    Após participar do evento, compartilhe sua experiência
                    deixando um comentário. Seu feedback é muito importante para
                    nós e para outros participantes. Você receberá uma
                    notificação para avaliar o evento assim que ele for
                    concluído.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Avaliações e comentários
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Melhoria contínua
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA - Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">
            Pronto para participar de nossos eventos?
          </h2>
          <p className="mb-6 text-green-100">
            Agora que você sabe como se inscrever, explore nossa lista de
            eventos e participe!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-white text-green-700 hover:bg-green-50">
                Ver eventos disponíveis
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-green-700"
              >
                Criar conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ComoInscrever;
