import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getUserData } from "@/hooks/AuthLocal";

const usuario = getUserData();

//Auxiliary Functions
/* Post */
export const auxPostInscricao = (data) => {
  return axios.post(`http://localhost:3333/inscricao/`, data);
};

/* Put */
export const auxPutEvento = (data) => {
  return axios.put(`http://localhost:3333/inscricao/${data?.id}`, {
    titulo: data?.titulo,
    descricao: data?.descricao,
    local: data?.local,
    data_inicio: data?.data_inicio,
    data_fim: data?.data_fim,
  });
};

//Main functions
export const usePostInscricao = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: auxPostInscricao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscricao"] });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate, isPending, error, isSuccess };
};

export const usePutEvento = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutEvento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscricao"] });
      queryClient.invalidateQueries({
        queryKey: ["inscricao", usuario?.usuario_id],
      });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate };
};

//Get
export const useGetInscricao = () => {
  return useQuery({
    queryKey: ["inscricao"],
    queryFn: () => {
      return axios
        .get("http://localhost:3333/inscricao")
        .then((response) => response.data);
    },
  });
};

export const useGetInscricoesUsuario = (usuario_id) => {
  const { data, isFetched, isLoading, error } = useQuery({
    queryKey: ["inscricao", usuario_id],
    queryFn: () =>
      axios.get(`http://localhost:3333/usuarios/${usuario_id}/inscricoes`),
    enabled: !!usuario_id,
  });
  return { data, isFetched, isLoading, error };
};
