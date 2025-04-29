# SchoolEvents Frontend - Documentação

## Descrição

Frontend do sistema "Sem nome" de Gestão de Atividades Escolares do Instituto Médio de Tecnologia da Saúde - RADLUK. Esta interface permite a interação dos usuários com as funcionalidades de gestão de atividades extracurriculares, actividades, participação e feedback.

## Requisitos do Sistema

- Node.js (v18 ou superior)
- npm ou yarn
- API SchoolEvents configurada e em execução

## Configuração Inicial

### 1. Clonando o Repositório

```bash
git clone https://github.com/emersonalbino20/schoolevents-front.git
cd schoolevents
```

### 2. Instalação de Dependências

```bash
npm install
```

### 3. Configuração do Ambiente

## Comandos Disponíveis

| Comando           | Descrição                                                     |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento Vite na porta 5173.      |
| `npm run build`   | Compila o projeto para produção.                              |
| `npm run lint`    | Executa o linter para verificar problemas de código.          |
| `npm run preview` | Inicia um servidor local para visualizar a build de produção. |

## Primeiros Passos

1. Certifique-se de que a API está em execução (porta 3333)
2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Acesse a aplicação em `http://localhost:5173`

## Tecnologias Utilizadas

- **React**: Biblioteca JS para construção de interfaces
- **Tailwind CSS**: Framework utilitário para estilização
- **ShadCN UI**: Componentes acessíveis estilizados com Tailwind
- **TanStack React Query**: Gerenciador de estado assíncrono para chamadas à API
- **Zod**: Biblioteca de validação de esquemas de dados

## Estrutura do Projeto

```
src/
├── assets/       # Recursos estáticos (imagens, logos)
├── components/   # Componentes reutilizáveis
├── contexts/     # Contextos React (AuthContext, etc.)
├── hooks/        # Custom hooks
├── lib/          # Utilitários e configurações
├── pages/        # Páginas da aplicação
├── services/     # Serviços para comunicação com a API
└── styles/       # Estilos globais
```

## Desenvolvimento e Contribuição

Para contribuir com o desenvolvimento:

1. Crie uma branch para sua funcionalidade: `git checkout -b feature/nova-funcionalidade`
2. Faça commit das suas alterações: `git commit -m 'feat: adiciona nova funcionalidade'`
3. Envie para o repositório remoto: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

## Licença

Este projeto está sob a licença [MIT](LICENSE).

## Equipe

- Stackholder do Projeto: José Salakiaku Castelo
- Desenvolvimento: Emerson J.T Albino
