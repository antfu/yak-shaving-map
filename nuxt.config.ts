import fs from 'node:fs'

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

  vite: {
    plugins: [
      {
        name: 'server',
        configureServer(server) {
          server.ws.on('connection', (socket) => {
            socket.on('message', (data) => {
              const payload = JSON.parse(data.toString()) as any
              if (payload.type === 'custom' && payload.event === 'yak-map-pos') {
                fs.writeFileSync('yak-map-pos.json', JSON.stringify(payload.data))
              }
            })
          })
        },
      },
    ],
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})