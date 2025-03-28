// eslint.config.js
import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import globals from "globals";

export default [
    {
        files: ["**/*.js", "**/*.ts", "**/*.vue"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            vue,
        },
        rules: {
            // Add your rules here
            "vue/multi-word-component-names": "off",
        },
    },
];
