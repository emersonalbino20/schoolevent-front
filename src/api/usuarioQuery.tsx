import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

//PORTA DA API
const PORT = 3333;

//Auxilary Functions
/* Post */
export const auxPostLogin = (data) => {
  return axios.post(`http://localhost:${PORT}/login/`, data);
};

export const auxPostUsuarios = (formData) => {
  return axios.post(`http://localhost:${PORT}/usuarios/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const auxPutUsuario = (formData) => {
  const userId = formData.id;

  return axios.put(`http://localhost:${PORT}/usuarios/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//main functions
export const usePostLogin = () => {
  const { mutate } = useMutation({
    mutationFn: auxPostLogin,
  });
  return { mutate };
};

export const usePostUsuarios = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostUsuarios,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate };
};

export const usePutUsuario = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate };
};

//Get
export const useGetUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: () => {
      return axios
        .get(`http://localhost:${PORT}/usuarios`)
        .then((response) => response.data);
    },
  });
};

export const useGetUsuario = (id) => {
  const { data, isFetched, isLoading } = useQuery({
    queryKey: ["usuarios", id],
    queryFn: () => axios.get(`http://localhost:${PORT}/usuarios/${id}`),
    enabled: !!id,
  });
  return { data, isFetched, isLoading };
};
