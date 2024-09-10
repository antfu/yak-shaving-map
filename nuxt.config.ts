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

  imports: {
    autoImport: false,
  },

  app: {
    head: {
      title: 'Anthony Fu\'s Yak Map',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.svg' },
      ],
    },
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
                fs.writeFileSync('yak-map-pos.json', `${JSON.stringify(payload.data, null, 2)}\n`)
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

  compatibilityDate: '2024-09-10',
})
