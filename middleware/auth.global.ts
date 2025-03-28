export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = useAuthStore();

    // // Wait for the store initialization or rehydration
    // if (!auth.isAuthenticated && to.path !== "/login" && !auth.isLoading) {
    //     return navigateTo("/login");
    // }

    // // After store has been initialized, proceed
    // auth.isLoading = false;
});
