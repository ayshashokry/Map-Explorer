import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import sidemenu_ar from "./locales/ar/sidemenu.json";
import sidemenu_en from "./locales/en/sidemenu.json";
import common_ar from "./locales/ar/common.json";
import common_en from "./locales/en/common.json";
import map_ar from "./locales/ar/map.json";
import map_en from "./locales/en/map.json";
import help_ar from "./locales/ar/help.json";
import help_en from "./locales/en/help.json";
import forms_ar from "./locales/ar/forms.json";
import forms_en from "./locales/en/forms.json";
import print_ar from "./locales/ar/print.json";
import print_en from "./locales/en/print.json";
import layers_ar from "./locales/ar/layers.json";
import layers_en from "./locales/en/layers.json";
import dashboard_ar from "./locales/ar/dashboard.json";
import dashboard_en from "./locales/en/dashboard.json";
i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      ar: {
        common: common_ar,
        sidemenu: sidemenu_ar,
        map: map_ar,
        help: help_ar,
        forms: forms_ar,
        print: print_ar,     
        layers: layers_ar,
        dashboard:dashboard_ar
      },
      en: {
        common: common_en,
        sidemenu: sidemenu_en,
        map: map_en,
        help: help_en,
        forms: forms_en,
        print: print_en,      
        layers: layers_en,
        dashboard:dashboard_en
      },
    },
    lng: ["ar", "en"],
    fallbackLng: "ar",
    // debug: false,
    backend: {
      loadPath: "../public/locales/{{lng}}/{{ns}}.json",
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    // react: {
    //   useSuspense: false,
    // },
  });
export default i18n;
