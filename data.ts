import type { Node } from 'vis-network'
import poisitions from './yak-map-pos.json'

export interface ProjectNode extends Partial<Node> {
  name: string
  display?: string
  link: string
  color?: string
  dashed?: boolean
  faded?: boolean
  from?: string[]
  deps?: string[]
  animateStop?: boolean
}

const colors = {
  vue: '#34ba67',
  nuxt: '#00DC82',
  vite: '#454ce1',
  unjs: '#982',
  ts: '#007ACC',
  vscode: '#007ACC',
  vitesse: '#895',
  slidev: '#2ae',
  vitest: '#82ba34',
  unplugin: '#525',
  eslint: '#53f',
  shiki: '#CB7676',
  twoslash: '#183F66',
}

export const primary: ProjectNode[] = [
  {
    name: 'breadsplit',
    display: 'BreakSplit',
    link: 'https://github.com/breadsplit/breadsplit',
    color: '#555',
    x: 0,
    y: 0,
  },
  {
    name: 'i18n-ally',
    display: 'i18n Ally',
    link: 'https://github.com/lokalise/i18n-ally',
    color: '#351',
    from: ['breadsplit'],
  },
  {
    name: 'vueuse',
    display: 'VueUse',
    link: 'https://github.com/vueuse/vueuse',
    from: ['breadsplit'],
    shape: 'circle',
    color: colors.vue,
  },
  {
    name: '@vue/composition-api',
    link: 'https://github.com/vuejs/composition-api',
    color: colors.vue,
    dashed: true,
    from: ['vueuse'],
  },
  {
    name: 'vue-demi',
    display: 'VueDemi',
    link: 'https://github.com/vueuse/vue-demi',
    color: colors.vue,
    from: ['vueuse', '@vue/composition-api'],
  },
  {
    name: 'vue',
    display: 'Vue 3',
    link: 'https://github.com/vuejs/core',
    color: colors.vue,
    shape: 'circle',
    dashed: true,
    margin: 10 as any,
    from: ['@vue/composition-api', 'vue-demi'],
  },
  {
    name: 'vue-reactivity',
    display: 'Vue Reactivity',
    link: 'https://github.com/vue-reactivity',
    color: colors.vue,
    from: ['vue'],
  },
  {
    name: 'reactivue',
    display: 'ReactiVue',
    link: 'https://github.com/antfu/reactivue',
    color: '#42b8a6',
    from: ['vue'],
    animateStop: false,
  },
  {
    name: 'vite',
    display: 'Vite',
    shape: 'circle',
    margin: 15 as any,
    link: 'https://github.com/vitejs/vite',
    color: colors.vite,
    dashed: true,
    from: ['vue'],
  },
  {
    name: 'icones',
    display: 'Icones',
    link: 'https://github.com/antfu/icones',
    color: '#834',
    shape: 'circle',
    from: ['vite', 'vue'],
  },
  {
    name: 'vite-pwa',
    link: 'https://github.com/vite-pwa',
    color: '#750',
    from: ['icones', 'vite'],
  },
  {
    name: 'unplugin-vue-components',
    link: 'https://github.com/unplugin/unplugin-vue-components',
    color: '#525',
    from: ['icones'],
  },
  {
    name: 'unplugin-auto-import',
    link: 'https://github.com/unplugin/unplugin-auto-import',
    color: '#525',
    from: ['icones'],
    animateStop: false,
  },
  {
    name: 'unplugin-icons',
    link: 'https://github.com/unplugin/unplugin-icons',
    color: '#525',
    from: ['icones'],
    animateStop: false,
  },
  {
    name: 'iconify',
    display: 'Iconify',
    link: 'https://iconify.design/',
    color: '#814',
    dashed: true,
    shape: 'circle',
    from: ['unplugin-icons'],
  },
  {
    name: 'vscode',
    display: 'VS Code',
    link: 'https://github.com/microsoft/vscode',
    color: '#007ACC',
    dashed: true,
    shape: 'circle',
    from: ['i18n-ally'],
  },
  {
    name: 'Iconify IntelliSense',
    link: 'https://github.com/antfu/vscode-iconify',
    color: '#814',
    from: ['iconify', 'vscode'],
  },
  {
    name: 'vite-plugin-inspect',
    link: 'https://github.com/antfu-collective/vite-plugin-inspect',
    color: colors.vite,
    from: ['unplugin-vue-components'],
  },
  {
    name: 'vitesse',
    display: 'Vitesse',
    shape: 'circle',
    link: 'https://github.com/antfu/vitesse',
    color: colors.vitesse,
    from: ['icones', 'unplugin-vue-components', 'unplugin-auto-import', 'vite-pwa', 'unplugin-icons'],
    deps: ['vueuse'],
  },
  {
    name: 'vitesse-webext',
    link: 'https://github.com/antfu/vitesse-webext',
    color: colors.vitesse,
    from: ['vitesse'],
  },
  {
    name: 'webext-bridge',
    link: 'https://github.com/serversideup/webext-bridge',
    color: '#405',
    from: ['vitesse-webext'],
  },
  {
    name: 'antfu.me',
    link: 'https://antfu.me',
    color: '#459',
    from: ['vitesse'],
  },
  {
    name: 'unplugin-vue-markdown',
    link: 'https://github.com/unplugin/unplugin-vue-markdown',
    color: '#459',
    from: ['antfu.me'],
    deps: ['vitesse'],
  },
  {
    name: 'vite-ssg',
    link: 'https://github.com/antfu/vite-ssg',
    color: '#459',
    from: ['antfu.me'],
    deps: ['vitesse'],
  },
  {
    name: 'windicss',
    display: 'Windi CSS',
    link: 'https://github.com/windicss/windicss',
    color: '#09f',
    dashed: true,
    from: ['vitesse'],
  },
  {
    name: 'slidev',
    display: 'Slidev',
    link: 'https://github.com/slidevjs/slidev',
    color: '#2ae',
    shape: 'circle',
    from: ['vitesse', 'vite'],
    deps: ['windicss', 'vueuse'],
  },
  {
    name: 'broz',
    link: 'https://github.com/antfu/broz',
    color: '#2ae',
    from: ['slidev'],
  },
  {
    name: 'drauu',
    link: 'https://github.com/antfu/drauu',
    color: '#2ae',
    from: ['slidev'],
    animateStop: false,
  },
  {
    name: 'unocss',
    display: 'UnoCSS',
    link: 'https://github.com/unocss/unocss',
    color: '#304',
    from: ['slidev', 'windicss'],
    deps: ['vitesse'],
  },
  {
    name: 'css-icons',
    display: 'Pure CSS Icons',
    link: 'https://unocss.dev/presets/icons',
    color: '#304',
    from: ['unocss', 'iconify'],
  },
  {
    name: 'nuxt',
    display: 'Nuxt',
    shape: 'circle',
    link: 'https://github.com/nuxt/nuxt',
    dashed: true,
    margin: 18 as any,
    color: colors.nuxt,
    from: ['vitesse'],
  },
  {
    name: 'vitesse-nuxt3',
    link: 'https://github.com/antfu/vitesse-nuxt3',
    color: colors.vitesse,
    from: ['vitesse', 'nuxt'],
  },
  {
    name: 'unplugin',
    link: 'https://github.com/unjs/unplugin',
    color: colors.unjs,
    from: ['nuxt'],
    deps: ['unplugin-icons', 'unplugin-auto-import', 'unplugin-vue-components'],
  },
  {
    name: 'unimport',
    link: 'https://github.com/unjs/unimport',
    color: colors.unjs,
    from: ['nuxt', 'unplugin-auto-import'],
  },
  {
    name: 'vite-node',
    link: 'https://github.com/vitest-dev/vitest/tree/main/packages/vite-node',
    color: colors.vitest,
    from: ['nuxt', 'vite'],
  },
  {
    name: 'vitest',
    display: 'Vitest',
    shape: 'circle',
    link: 'https://github.com/vitest-dev/vitest',
    color: colors.vitest,
    from: ['vite', 'vite-node'],
  },
  {
    name: 'birpc',
    link: 'https://github.com/antfu/birpc',
    color: '#bd3',
    from: ['vitest'],
  },
  {
    name: 'nuxt-devtools',
    display: 'Nuxt DevTools',
    link: 'https://github.com/nuxt/devtools',
    color: '#00c58e',
    from: ['nuxt', 'birpc', 'vite-plugin-inspect'],
  },
  {
    name: 'magicast',
    link: 'https://github.com/unjs/magicast',
    color: '#982',
    from: ['nuxt-devtools'],
    deps: ['nuxt'],
  },
  {
    name: 'elk',
    display: 'Elk',
    link: 'https://github.com/elk-zone/elk',
    color: '#ea9e44',
    from: ['nuxt'],
  },
  {
    name: 'learn.nuxt.com',
    link: 'https://github.com/nuxt/learn.nuxt.com',
    color: '#00c58e',
    from: ['nuxt'],
  },

  {
    name: 'shiki',
    display: 'Shiki',
    link: 'https://github.com/shikijs/shiki',
    dashed: true,
    shape: 'circle',
    color: colors.shiki,
    from: ['nuxt', 'antfu.me', 'slidev'],
  },
  {
    name: 'shiki-magic-move',
    link: 'https://github.com/shikijs/shiki-magic-move',
    color: colors.shiki,
    from: ['shiki', 'slidev'],
  },
  {
    name: 'shiki/monaco',
    link: 'https://github.com/shikijs/shiki',
    color: colors.shiki,
    from: ['learn.nuxt.com', 'shiki'],
  },
  {
    name: 'twoslash',
    display: 'Twoslash',
    link: 'https://github.com/twoslashes/twoslash',
    color: colors.twoslash,
    dashed: true,
    from: ['shiki'],
  },
  {
    name: '@antfu/eslint-config',
    link: 'https://github.com/antfu/eslint-config',
    color: colors.eslint,
  },
  {
    name: 'eslint-stylistic',
    display: 'ESLint Stylistic',
    link: 'https://github.com/eslint-stylistic/eslint-stylistic',
    color: '#59f',
    from: ['@antfu/eslint-config'],
  },
  {
    name: '@eslint/config-inspector',
    display: 'ESLint Config Inspector',
    link: 'https://github.com/eslint/config-inspector',
    color: colors.eslint,
    from: ['@antfu/eslint-config', 'nuxt-devtools'],
  },
  {
    name: 'eslint-plugin-format',
    link: 'https://github.com/antfu/eslint-plugin-format',
    color: colors.eslint,
    from: ['@antfu/eslint-config'],
  },
  {
    name: 'eslint-plugin-command',
    link: 'https://github.com/antfu/eslint-plugin-command',
    color: colors.eslint,
    animateStop: false,
    from: ['@antfu/eslint-config'],
  },
  {
    name: 'eslint-flat-config-utils',
    link: 'https://github.com/antfu/eslint-flat-config-utils',
    color: colors.eslint,
    animateStop: false,
    from: ['@antfu/eslint-config'],
  },
  {
    name: 'eslint-typegen',
    link: 'https://github.com/antfu/eslint-typegen',
    color: colors.eslint,
    animateStop: false,
    from: ['@antfu/eslint-config'],
  },
  {
    name: '@nuxt/eslint',
    display: 'Nuxt ESLint',
    link: 'https://github.com/nuxt/eslint',
    color: colors.nuxt,
    from: ['nuxt', 'eslint-typegen', '@eslint/config-inspector'],
  },
]

export const secondary: ProjectNode[] = [
  {
    name: 'handle',
    display: 'Handle',
    link: 'https://github.com/antfu/handle',
    from: ['vitesse'],
  },
  {
    name: 'v-dollar',
    link: 'https://github.com/antfu/v-dollar',
    color: colors.vue,
    from: ['vue'],
  },
  {
    name: 'vue-starport',
    display: 'Vue Starport',
    link: 'https://github.com/antfu/vue-starport',
    color: colors.vue,
    from: ['vue', 'slidev'],
  },
  {
    name: 'vite-plugin-restart',
    link: 'https://github.com/antfu/vite-plugin-restart',
    color: colors.vite,
    from: ['vite'],
  },
  {
    name: 'vite-plugin-remote-assets',
    link: 'https://github.com/antfu/vite-plugin-remote-assets',
    color: colors.vite,
    from: ['vite'],
  },
  {
    name: 'vite-plugin-vue-server-ref',
    link: 'https://github.com/antfu/vite-plugin-vue-server-ref',
    color: colors.vite,
    from: ['vite'],
  },
  {
    name: 'vitesse-theme',
    display: 'Vitesse Theme',
    link: 'https://github.com/antfu/vscode-theme-vitesse',
    color: colors.vitesse,
    from: ['vscode', 'vueuse'],
  },
  {
    name: 'qrcode-toolkit',
    display: 'QR Toolkit',
    link: 'https://github.com/antfu/qrcode-toolkit',
  },
  {
    name: 'uqr',
    link: 'https://github.com/unjs/uqr',
    color: colors.unjs,
    from: ['qrcode-toolkit'],
  },
  {
    name: 'ni',
    link: 'https://github.com/antfu/ni',
    color: '#153',
  },
  {
    name: 'sponsorkit',
    display: 'SponsorKit',
    link: 'https://github.com/antfu/sponsorkit',
    color: '#a83266',
  },
  {
    name: 'type-challenges',
    display: 'Type Challenges',
    link: 'https://github.com/type-challenges/type-challenges',
    color: colors.ts,
  },
  {
    name: 'esno',
    link: 'https://github.com/antfu/esno',
    from: ['type-challenges'],
    color: colors.ts,
  },
  {
    name: 'taze',
    link: 'https://github.com/antfu/taze',
    color: '#33b85d',
  },
  {
    name: 'qr-scanner-wechat',
    link: 'https://github.com/antfu/qr-scanner-wechat',
    from: ['qrcode-toolkit'],
    color: colors.vue,
  },
  {
    name: 'vscode-file-nesting',
    display: 'VS Code File Nesting',
    link: 'https://github.com/antfu/vscode-file-nesting-config',
    from: ['vscode'],
    color: colors.vscode,
  },
  {
    name: 'vscode-smart-clicks',
    display: 'VS Code Smart Clicks',
    link: 'https://github.com/antfu/vscode-smart-clicks',
    from: ['vscode'],
    color: colors.vscode,
  },
  {
    name: 'retypewriter',
    display: 'retypewriter',
    link: 'https://github.com/antfu/retypewriter',
    from: ['vscode'],
    color: '#4cb833',
  },
  {
    name: 'twoslash-vue',
    display: 'Twoslash Vue',
    link: 'https://github.com/twoslashes/twoslash',
    color: colors.vue,
    from: ['twoslash'],
  },
  {
    name: 'vitepress-twoslash',
    display: 'VitePress Twoslash',
    link: 'https://github.com/shikijs/shiki',
    color: colors.vue,
    from: ['twoslash-vue'],
  },
  {
    name: 'nuxt-content-twoslash',
    display: 'Nuxt Content Twoslash',
    color: colors.nuxt,
    link: 'https://github.com/antfu/nuxt-content-twoslash',
    from: ['vitepress-twoslash', 'nuxt'],
  },
  {
    name: 'nuxt-icon',
    display: 'Nuxt Icon',
    link: 'https://github.com/nuxt/icon',
    color: colors.nuxt,
    dashed: true,
    from: ['iconify', 'nuxt'],
  },
]

secondary.forEach((p, idx) => {
  p.faded = true
  if (idx)
    p.animateStop = false
})

export const all = [
  ...primary,
  ...secondary,
]

for (const [id, pos] of Object.entries(poisitions) as [string, { x: number, y: number }][]) {
  if (!pos)
    continue
  const project = all.find(p => p.name === id)
  if (project)
    Object.assign(project, pos)
}

export {
  poisitions,
}
