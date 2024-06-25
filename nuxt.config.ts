export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxt/eslint',
  ],

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  ssr: false,

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  devtools: {
    enabled: true,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})
