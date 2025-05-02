import { z } from "zod";

const nameRegex = /^[A-Z][a-zà-öø-ÿ]+$/;

const phoneRegex = /^99|9[1-5]\d{7}$/gm;
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,255})/g;
// Regex para validar strings que não devem conter caracteres especiais indesejados
const titleRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s.,!?()-]+$/;
const descriptionRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s.,!?()[\]{}:;'"&@#$%*+-=/\\]+$/;
const localRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s.,()-]+$/;

export const schemeRegister = z
  .object({
    name: z.string().trim().min(4, "O nome deve ter pelo menos 4 caracteres"),
    email: z.string().trim().email("Digite um e-mail válido"),
    password: z
      .string()
      .trim()
      .regex(passwordRegex, {
        message: "Senha inválida",
      })
      .max(255, "Senha inválida"),
    confirmPassword: z.string().optional(),
    phone: z
      .string()
      .trim()
      .length(9, { message: "O telefone deve possuir exatamente 9 dígitos" })
      .regex(phoneRegex, {
        message:
          "Número de telefone inválido. Use um número que comece com 99 ou de 91 a 95.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const schemeLogin = z.object({
  email: z.string().trim().email("Digite um e-mail válido"),
  senha: z
    .string()
    .trim()
    .regex(passwordRegex, {
      message: "senha inválida.",
    })
    .max(255, "senha inválida."),
});

export const schemeUser = z.object({
  nome: z
    .string()
    .trim()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(10, { message: "O nome não pode ter mais de 10 caracteres" })
    .regex(nameRegex, {
      message: "O nome deve começar com maiúscula e não deve conter  espaços",
    }),
  sobrenome: z
    .string()
    .trim()
    .min(3, { message: "O sobrenome deve ter pelo menos 3 caracteres" })
    .max(10, { message: "O sobrenome não pode ter mais de 10 caracteres" })
    .regex(nameRegex, {
      message:
        "O sobrenome deve começar com maiúscula e não deve conter  espaços",
    }),
  email: z
    .string()
    .trim()
    .email({ message: "Digite um e-mail válido" })
    .max(255, { message: "O e-mail não pode ter mais de 255 caracteres" }),
  senha: z
    .string()
    .trim()
    .regex(passwordRegex, {
      message:
        "A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.",
    })
    .max(255, "A senha deve ter no máximo 255 caracteres"),
  tipo: z
    .enum(["administrador", "professor", "aluno"], {
      message: "Tipo de usuário inválido",
    })
    .default("aluno"),
});

export const schemeUserUp = z.object({
  id: z
    .number({
      message: "ID inválido",
    })
    .optional(),
  nome: z
    .string()
    .trim()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(10, { message: "O nome não pode ter mais de 10 caracteres" })
    .regex(nameRegex, {
      message: "O nome deve começar com maiúscula e não deve conter  espaços",
    }),
  sobrenome: z
    .string()
    .trim()
    .min(3, { message: "O sobrenome deve ter pelo menos 3 caracteres" })
    .max(10, { message: "O sobrenome não pode ter mais de 10 caracteres" })
    .regex(nameRegex, {
      message:
        "O sobrenome deve começar com maiúscula e não deve conter  espaços",
    }),
  email: z
    .string()
    .trim()
    .email({ message: "Digite um e-mail válido" })
    .max(255, { message: "O e-mail não pode ter mais de 255 caracteres" }),
  
  tipo: z
    .enum(["administrador", "professor", "aluno"], {
      message: "Tipo de usuário inválido",
    })
    .default("aluno"),
});

export const schemeMyProfileUp = z.object({
  id: z
    .number({
      message: "ID inválido",
    })
    .optional(),
  nome: z
    .string()
    .trim()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(10, { message: "O nome não pode ter mais de 10 caracteres" })
    .regex(nameRegex, {
      message: "O nome deve começar com maiúscula e não deve conter  espaços",
    }),
  sobrenome: z
    .string()
    .trim()
    .min(3, { message: "O sobrenome deve ter pelo menos 3 caracteres" })
    .max(10, { message: "O sobrenome não pode ter mais de 10 caracteres" })
    .regex(nameRegex, {
      message:
        "O sobrenome deve começar com maiúscula e não deve conter  espaços",
    }),
  email: z
    .string()
    .trim()
    .email({ message: "Digite um e-mail válido" })
    .max(255, { message: "O e-mail não pode ter mais de 255 caracteres" }),
    senha: z
    .string()
    .trim()
    .regex(passwordRegex, {
      message:
        "A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.",
    })
    .max(255, "A senha deve ter no máximo 255 caracteres"),
  tipo: z
    .enum(["administrador", "professor", "aluno"], {
      message: "Tipo de usuário inválido",
    })
    .default("aluno"),
});
export const schemeEvento = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(5, { message: "O título deve ter pelo menos 5 caracteres" })
      .max(30, { message: "O título não pode ter mais de 30 caracteres" })
      .regex(titleRegex, { message: "O título contém caracteres inválidos" }),

    descricao: z
      .string()
      .trim()
      .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" })
      .max(200, { message: "A descrição não pode ter mais de 200 caracteres" })
      .regex(descriptionRegex, {
        message: "A descrição contém caracteres inválidos",
      }),

    local: z
      .string()
      .trim()
      .min(3, { message: "O local deve ter pelo menos 3 caracteres" })
      .max(100, { message: "O local não pode ter mais de 100 caracteres" })
      .regex(localRegex, { message: "O local contém caracteres inválidos" }),

    data_inicio: z
      .string()
      .trim()
      .refine(
        (data) => {
          const dataObj = new Date(data);
          return !isNaN(dataObj.getTime());
        },
        { message: "A data de início é inválida" }
      )
      .refine(
        (data) => {
          const dataObj = new Date(data);
          const hoje = new Date();
          return dataObj >= hoje;
        },
        { message: "A data de início não pode ser anterior à data atual" }
      ),

    data_fim: z
      .string()
      .trim()
      .refine(
        (data) => {
          const dataObj = new Date(data);
          return !isNaN(dataObj.getTime());
        },
        { message: "A data de término é inválida" }
      ),
  })
  .refine(
    (data) => {
      const dataInicio = new Date(data.data_inicio);
      const dataFim = new Date(data.data_fim);

      if (dataFim < dataInicio) return false; // já valida se a data fim é antes

      const diffMs = dataFim.getTime() - dataInicio.getTime();
      const diffHours = diffMs / (1000 * 60 * 60); // converte ms para horas

      return diffHours >= 1 && diffHours <= 10;
    },
    {
      message: "A duração do evento deve ser entre 1 e 10 horas",
      path: ["data_fim"],
    }
  );

// Esquema para atualização de um evento existente
export const schemeEventoUp = z
  .object({
    id: z
      .number({
        message: "ID inválido",
      })
      .int({ message: "O ID deve ser um número inteiro" }),
    criado_por: z
      .number({
        message: "ID do usuário inválido",
      })
      .int({ message: "O ID do usuário deve ser um número inteiro" }),
    titulo: z
      .string()
      .trim()
      .min(5, { message: "O título deve ter pelo menos 5 caracteres" })
      .max(30, { message: "O título não pode ter mais de 30 caracteres" })
      .regex(titleRegex, { message: "O título contém caracteres inválidos" }),

    descricao: z
      .string()
      .trim()
      .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" })
      .max(200, {
        message: "A descrição não pode ter mais de 200 caracteres",
      })
      .regex(descriptionRegex, {
        message: "A descrição contém caracteres inválidos",
      }),

    local: z
      .string()
      .trim()
      .min(3, { message: "O local deve ter pelo menos 3 caracteres" })
      .max(100, { message: "O local não pode ter mais de 100 caracteres" })
      .regex(localRegex, { message: "O local contém caracteres inválidos" }),

    data_inicio: z
      .string()
      .trim()
      .refine(
        (data) => {
          // Verifica se a data está no formato correto e é uma data válida
          const dataObj = new Date(data);
          return !isNaN(dataObj.getTime());
        },
        { message: "A data de início é inválida" }
      ),

    data_fim: z
      .string()
      .trim()
      .refine(
        (data) => {
          const dataObj = new Date(data);
          return !isNaN(dataObj.getTime());
        },
        { message: "A data de término é inválida" }
      ),
  })
  .refine(
    (data) => {
      const dataInicio = new Date(data.data_inicio);
      const dataFim = new Date(data.data_fim);

      if (dataFim < dataInicio) return false; // já valida se a data fim é antes

      const diffMs = dataFim.getTime() - dataInicio.getTime();
      const diffHours = diffMs / (1000 * 60 * 60); // converte ms para horas

      return diffHours >= 1 && diffHours <= 10;
    },
    {
      message: "A duração do evento deve ser entre 1 e 10 horas",
      path: ["data_fim"],
    }
  );
