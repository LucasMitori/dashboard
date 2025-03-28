import axios from "axios";
import { useAuthStore } from "~/stores/authStore";

export const useApi = () => {
    const baseURL = "http://localhost:3000";
    const authStore = useAuthStore();

    return axios.create({
        baseURL,
        headers: {
            Authorization: `Token ${authStore.token}`,
        },
    });
};
