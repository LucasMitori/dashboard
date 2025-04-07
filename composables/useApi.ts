import axios from "axios";
import { useAuthStore } from "~/stores/authStore";

export const useApi = () => {
    const { public: publicRuntimeConfig } = useRuntimeConfig();
    const baseURL = publicRuntimeConfig.API_URL;
    const authStore = useAuthStore();

    return axios.create({
        baseURL,
        headers: {
            Authorization: `Token ${authStore.token}`,
        },
    });
};
