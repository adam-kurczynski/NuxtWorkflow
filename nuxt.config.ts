import { config } from "./server/db/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ui: {
    notifications: {
      position: 'top-0',
    },
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'info',
        'success',
        'warning',
        'error'
      ]
    },
  },
    compatibilityDate: "2026-08-19",
  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  // Nuxt Modules
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    'nuxt-auth-utils',
    '@nuxt/ui',
    //'@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@samk-dev/nuxt-vcalendar',
  ],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    exposeConfig: true,
  },
  hub: {
    kv: true,
    blob: true,
    cache: true,
    db: 'sqlite'
  },
  $production: {
    nitro: {
      preset: "cloudflare_module",
      cloudflare: {
        deployConfig: true,
        nodeCompat: true
      }
    }
  },
  // Development
  devtools: { enabled: true },
})