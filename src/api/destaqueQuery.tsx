import { useQuery } from "@tanstack/react-query";
import axios from "axios";

//Auxilary Functions
/* Post */

export const useGetDestaques = (evento_id) => {
  const { data, isFetched, isLoading } = useQuery({
    queryKey: ["destaques", evento_id],
    queryFn: () =>
      axios.get(`http://localhost:3333/destaques/evento/${evento_id}`),
    enabled: !!evento_id,
  });
  return { data, isFetched, isLoading };
};
