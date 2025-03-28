import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        user: useCookie("user").value,
        token: useCookie("token").value || null,
        isAuthenticated: !!useCookie("token").value,
        isLoading: true,
        redirectTo: "",
    }),
    actions: {
        async login(username: string, password: string) {
            const api = useApi();

            const response = await api({
                method: "post",
                url: "/api/login/",
                data: {
                    username: username,
                    password: password,
                },
            });

            if (!response) {
                throw new Error("invalid Credentials in store");
            }

            this.token = response.data.token;

            const tokenCookie = useCookie("token", {
                maxAge: 60 * 24 * 28,
                sameSite: true,
                secure: true,
            });

            tokenCookie.value = response.data.token;

            this.isAuthenticated = true;

            await navigateTo(
                (this as { redirectTo?: string }).redirectTo || "/dashboard"
            );
        },
        async logout() {
            const api = useApi();
            try {
                if (this.token) {
                    await api({
                        method: "post",
                        url: "/logout",
                        headers: { Authorization: `Bearer ${this.token}` },
                    });
                }
            } catch (error) {
                console.error("Logout error:", error);
            }

            // Clear cookies safely
            const userCookie = useCookie("user");
            const tokenCookie = useCookie("token");

            userCookie.value = null;
            tokenCookie.value = null;

            // Clear store state
            this.token = null;
            this.isAuthenticated = false;

            // // Redirect properly using `navigateTo`
            // navigateTo("/login");
        },
    },
});
