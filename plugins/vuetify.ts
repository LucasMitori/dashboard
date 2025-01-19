import "@mdi/font/css/materialdesignicons.css";
import { VTimePicker } from "vuetify/labs/VTimePicker";
import { VTreeview } from "vuetify/labs/VTreeview";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VNumberInput, VPullToRefresh } from "vuetify/labs/components";

const main = {
  dark: false,
  colors: {
    background: "#f4f3f2",
    primary: "#4CAF50",
    secondary: "#212121",
    tertiary: "#FF9800",
    quartenary: "#F5F5F5",
    errorSpecial: "#B00020",
    infoSpecial: "#2196F3",
    successSpecial: "#4CAF50",
    warningSpecial: "#FB8C00",
  },
  variables: {
    // 'border-color': '#000000',
    // 'border-opacity': 0.50,
    // 'disabled-opacity': 0.1,
  },
};

const LightTheme = {
  dark: false,
  colors: {
    background: "#f4f3f2",
    primary: "#4CAF50",
    secondary: "#212121",
    tertiary: "#FF9800",
    quartenary: "#F5F5F5",
    errorSpecial: "#B00020",
    infoSpecial: "#2196F3",
    successSpecial: "#4CAF50",
    warningSpecial: "#FB8C00",
  },
  variables: {
    // 'border-color': '#000000',
    // 'border-opacity': 0.50,
    // 'disabled-opacity': 0.1,
  },
};

const DarkTheme = {
  dark: true,
  colors: {
    background: "#f4f3f2",
    primary: "#4CAF50",
    secondary: "#212121",
    tertiary: "#FF9800",
    quartenary: "#F5F5F5",
    errorSpecial: "#B00020",
    infoSpecial: "#2196F3",
    successSpecial: "#4CAF50",
    warningSpecial: "#FB8C00",
  },
  variables: {
    // 'border-color': '#000000',
    // 'border-opacity': 0.50,
    // 'disabled-opacity': 0.1,
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "main",
      themes: {
        main,
        LightTheme,
        DarkTheme,
      },
    },
    components: {
      VTimePicker,
      VTreeview,
      VNumberInput,
      VPullToRefresh,
    },
  });
  app.vueApp.use(vuetify);
});
