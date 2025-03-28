import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        user: useCookie("user").value,
        token: useCookie("token").value,
        isAuthenticated: useCookie("token").value ? true : false,
        redirectTo: "",
    }),
    actions: {
        async login(username: string, password: string) {
            const api = useApi();

            const apiUrl =
                process.env.NODE_ENV === "production"
                    ? "https://dashboard-orpin-omega-25.vercel.app/"
                    : "http://localhost:3000";

            const response = await api({
                method: "post",
                url: `${apiUrl}/api/login/`,
                data: {
                    username: username,
                    password: password,
                },
            });

            if (!response) {
                throw new Error("Invalid Credentials");
            }

            this.token = response.data.token;

            const tokenCookie = useCookie("token", {
                maxAge: 60 * 24 * 28,
                sameSite: true,
                secure: true,
            });

            tokenCookie.value = response.data.token;

            this.isAuthenticated = true;

            await navigateTo(this.redirectTo || "/");
        },
        async logout() {
            const api = useApi();
            try {
                if (this.token) {
                    const apiUrl =
                        process.env.NODE_ENV === "production"
                            ? "https://dashboard-orpin-omega-25.vercel.app/"
                            : "http://localhost:3000";
                    await api({
                        method: "post",
                        url: `${apiUrl}/logout`,
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

            this.token = null;
            this.isAuthenticated = false;

            // Redirect properly using `navigateTo`
            // navigateTo("/login");
        },
    },
});
