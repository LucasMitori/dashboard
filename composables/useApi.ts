import axios from "axios";
import { useMyAuthStore } from "~/stores/authStore";

export const useApi = () => {
  const baseURL = "http://localhost:3000";
  const authStore = useMyAuthStore();

  return axios.create({
    baseURL,
    headers: {
      Authorization: `Token ${authStore.token}`,
    },
  });
};
