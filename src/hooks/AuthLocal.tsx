// Define a chave principal para armazenar os dados
const USER_DATA_KEY = "userData";

// Função para criar o localStorage com dados e tempo de expiração (24h)
// Já redireciona conforme o tipo
export function setUserData(
  {
    usuario_id,
    nome,
    sobrenome,
    email,
    tipo,
  }: {
    usuario_id: number;
    nome: string;
    sobrenome: string;
    email: string;
    tipo: string;
  },
  navigate: (path: string) => void
) {
  const now = new Date();
  const expiration = now.getTime() + 24 * 60 * 60 * 1000; // 24 horas em ms

  const userData = {
    usuario_id,
    nome,
    sobrenome,
    email,
    tipo,
    expiration,
  };

  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

  // Redirecionamento automático
  if (tipo === "administrador") {
    navigate("/admin");
  } else {
    navigate("/");
  }
}

// Função para buscar o localStorage
export function getUserData() {
  const stored = localStorage.getItem(USER_DATA_KEY);

  if (!stored) return null;

  const userData = JSON.parse(stored);

  // Verifica se expirou
  const now = new Date();
  if (now.getTime() > userData.expiration) {
    clearUserData();
    return null;
  }
  return userData;
}

// Função para deletar o localStorage e redirecionar para login
export function clearUserData(navigate?: (path: string) => void) {
  localStorage.removeItem(USER_DATA_KEY);
  if (navigate) {
    navigate("/login");
  }
}
