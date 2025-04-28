import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

//Auxiliary Functions
/* Post */
export const auxPostEventos = (data) => {
  return axios.post(`http://localhost:3333/eventos/`, data);
};

export const auxPostImagensEvento = (data) => {
  return axios.post(`http://localhost:3333/evento-imagem/multiplas`, data);
};

/* Put */
export const auxPutEvento = (data) => {
  return axios.put(`http://localhost:3333/eventos/${data?.id}`, {
    titulo: data?.titulo,
    descricao: data?.descricao,
    local: data?.local,
    data_inicio: data?.data_inicio,
    data_fim: data?.data_fim,
  });
};

export const auxPutImagensEvento = (data) => {
  return axios.put(`http://localhost:3333/evento-imagen/${data?.id}`, {
    url: data?.url,
    descricao: data?.descricao,
  });
};

/* Delete */
export const auxDeleteEvento = (id) => {
  return axios.delete(`http://localhost:3333/eventos/${id}`);
};

//Main functions
export const usePostEventos = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostEventos,
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

export const usePostImagensEvento = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostImagensEvento,
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

export const usePutEvento = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutEvento,
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

export const usePutImagensEvento = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutImagensEvento,
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

export const useDeleteEvento = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxDeleteEvento,
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
export const useGetEventos = () => {
  return useQuery({
    queryKey: ["eventos"],
    queryFn: () => {
      return axios
        .get("http://localhost:3333/eventos")
        .then((response) => response.data);
    },
  });
};

export const useGetEvento = (id) => {
  const { data, isFetched, isLoading } = useQuery({
    queryKey: ["eventos", id],
    queryFn: () => axios.get(`http://localhost:3333/eventos/${id}`),
    enabled: !!id,
  });
  return { data, isFetched, isLoading };
};

// Get eventos futuros (filtrado por data)
export const useGetEventosFuturos = () => {
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
export const useGetEventosPorLocal = (local) => {
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
