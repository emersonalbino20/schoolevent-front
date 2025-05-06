import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

//Auxilary Functions
/* Post */

export const auxPostComentarios = (data) => {
  return axios.post(`http://localhost:3333/comentarios/`, data);
};

export const auxPutUsuario = (data) => {
  return axios.put(`http://localhost:3333/comentarios/${data?.id}`, {
    usuario_id: data?.usuario_id,
    evento_id: data?.evento_id,
    texto: data?.texto,
  });
};

//main functions
export const usePostComentarios = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: auxPostComentarios,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate, isPending };
};

export const usePutUsuario = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comentarios"] });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate };
};

//Get
export const useGetComentarios = () => {
  return useQuery({
    queryKey: ["comentarios"],
    queryFn: () => {
      return axios
        .get("http://localhost:3333/comentarios")
        .then((response) => response.data);
    },
  });
};

export const useGetComentariosUsuario = (usuario_id) => {
  const { data, isFetched, isLoading, error } = useQuery({
    queryKey: ["comentarios-usuario", usuario_id],
    queryFn: () =>
      axios.get(`http://localhost:3333/comentarios/${Number(usuario_id)}`),
    enabled: !!usuario_id,
  });
  return { data, isFetched, isLoading, error };
};
