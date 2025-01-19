import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";

export const useMyAuthStore = defineStore("myAuthStore", {
  state: () => ({
    user: useCookie("user").value,
    token: useCookie("token").value,
    isAuthenticated: useCookie("token").value ? true : false,
    redirectTo: "",
  }),
  actions: {
    async login(username: string, password: string) {
      const api = useApi();

      const response = await api({
        method: "post",
        url: "/auth/login/",
        data: {
          username: username,
          password: password,
        },
      });

      if (!response) {
        throw new Error("invalid Credentials");
      }

      this.token = response.data.token;

      const tokenCookie = useCookie("token", {
        maxAge: 60 * 24 * 28,
        sameSite: true,
        secure: true,
      });

      tokenCookie.value = response.data.token;

      this.isAuthenticated = true;

      await navigateTo((this as { redirectTo?: string }).redirectTo || "/");
    },
  },
});
