import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

//Auxiliary Functions
/* Post */
export const auxPostActividades = (data) => {
  return axios.post(`http://localhost:3333/eventos/`, data);
};

export const auxPostImagensActividade = (data) => {
  return axios.post(`http://localhost:3333/evento-imagem/multiplas`, data);
};

/* Put */
export const auxPutActividade = (data) => {
  return axios.put(`http://localhost:3333/eventos/${data?.id}`, {
    titulo: data?.titulo,
    descricao: data?.descricao,
    local: data?.local,
    data_inicio: data?.data_inicio,
    data_fim: data?.data_fim,
  });
};

export const auxPutImagensActividade = (data) => {
  return axios.put(`http://localhost:3333/evento-imagen/${data?.id}`, {
    url: data?.url,
    descricao: data?.descricao,
  });
};

/* Delete */
export const auxDeleteActividade = (id) => {
  return axios.delete(`http://localhost:3333/eventos/${id}`);
};

//Main functions
export const usePostActividades = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostActividades,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate };
};

export const usePostImagensActividade = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostImagensActividade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imagens-evento"] });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate };
};

export const usePutActividade = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutActividade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate };
};

export const usePutImagensActividade = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutImagensActividade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imagens-evento"] });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate };
};

export const useDeleteActividade = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxDeleteActividade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate };
};

//Get
export const useGetActividades = () => {
  return useQuery({
    queryKey: ["eventos"],
    queryFn: () => {
      return axios
        .get("http://localhost:3333/eventos")
        .then((response) => response.data);
    },
  });
};

export const useGetActividade = (id) => {
  const { data, isFetched, isLoading } = useQuery({
    queryKey: ["eventos", id],
    queryFn: () => axios.get(`http://localhost:3333/eventos/${id}`),
    enabled: !!id,
  });
  return { data, isFetched, isLoading };
};

// Get eventos futuros (filtrado por data)
export const useGetActividadesFuturos = () => {
  return useQuery({
    queryKey: ["eventos", "futuros"],
    queryFn: () => {
      const dataAtual = new Date().toISOString();
      return axios
        .get(`http://localhost:3333/eventos?data_inicio_gte=${dataAtual}`)
        .then((response) => response.data);
    },
  });
};

// Get eventos por local
export const useGetActividadesPorLocal = (local) => {
  return useQuery({
    queryKey: ["eventos", "local", local],
    queryFn: () => {
      return axios
        .get(`http://localhost:3333/eventos?local=${local}`)
        .then((response) => response.data);
    },
    enabled: !!local,
  });
};
