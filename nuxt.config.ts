// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ui: {
    notifications: {
      position: 'top-0',
    }
  },
  compatibilityDate: '2024-07-30',
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
    database: true,
    kv: true,
    blob: true,
    cache: true,
  },
  nitro: {
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true
    }
  },
  // Development
  devtools: { enabled: true },
})