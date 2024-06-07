// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false, },
  modules: [
    '@element-plus/nuxt',
    '@unocss/nuxt',
  ],
  nitro: {
    experimental: {
      websocket: true
    }
  }
})
