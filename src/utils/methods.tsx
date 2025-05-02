// Formatar data para exibição
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

// Formatar hora para exibição
export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
