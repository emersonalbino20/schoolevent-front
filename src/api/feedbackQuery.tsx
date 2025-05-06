import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

//Auxilary Functions
/* Post */

export const auxPostFeedbacks = (data) => {
  return axios.post(`http://localhost:3333/feedbacks/`, data);
};


//main functions
export const usePostFeedbacks = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: auxPostFeedbacks,
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
