import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    ssr: false,
    build: {
        transpile: ["vuetify"],
    },
    modules: [
        "@nuxtjs/i18n",
        (_options, nuxt) => {
            nuxt.hooks.hook("vite:extendConfig", (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }));
            });
        },
        [
            "@pinia/nuxt",
            {
                autoImports: ["defineStore", "acceptHMRUpdate"],
            },
        ],
    ],
    css: ["@/assets/css/main.css"],
    imports: {
        dirs: ["./stores/**"],
    },
    i18n: {
        vueI18n: "./i18n.config.ts",
    },
    vite: {
        optimizeDeps: {
            include: ["@intlify/shared"],
        },
        vue: {
            template: {
                transformAssetUrls,
            },
        },
        server: {
            hmr: {
                overlay: false,
            },
        },
    },
    runtimeConfig: {
        MONGODB_URI: process.env.MONGODB_URI as string,
    },
    nitro: {
        plugins: ["~/server/plugins/mongoose.ts"],
    },
});
