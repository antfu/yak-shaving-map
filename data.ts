import type { Node } from 'vis-network'
import poisitions from './yak-map-pos.json'

export interface ProjectNode extends Partial<Node> {
  name: string
  display?: string
  link: string
  color?: string
  dashed?: boolean
  from?: string[]
  deps?: string[]
  animateStop?: boolean
}

export const projects: ProjectNode[] = [
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
    color: '#42b883',
  },
  {
    name: '@vue/composition-api',
    link: 'https://github.com/vuejs/composition-api',
    color: '#42b883',
    dashed: true,
    from: ['vueuse'],
  },
  {
    name: 'vue-demi',
    display: 'VueDemi',
    link: 'https://github.com/vueuse/vue-demi',
    color: '#42b883',
    from: ['vueuse', '@vue/composition-api'],
  },
  {
    name: 'vue',
    display: 'Vue 3',
    link: 'https://github.com/vuejs/core',
    color: '#42b883',
    shape: 'circle',
    dashed: true,
    margin: 10 as any,
    from: ['@vue/composition-api', 'vue-demi'],
  },
  {
    name: 'vue-reactivity',
    display: 'Vue Reactivity',
    link: 'https://github.com/vue-reactivity',
    color: '#42b883',
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
    color: '#454ce1',
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
    from: ['icones'],
  },
  {
    name: 'unplugin-vue-components',
    link: 'https://github.com/unplugin/unplugin-vue-components',
    color: '#525',
    from: ['icones'],
    animateStop: false,
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
    name: 'Iconify IntelliSense',
    link: 'https://github.com/antfu/vscode-iconify',
    color: '#814',
    from: ['iconify'],
  },
  {
    name: 'vite-plugin-inspect',
    link: 'https://github.com/antfu-collective/vite-plugin-inspect',
    color: '#454ce1',
    from: ['unplugin-vue-components'],
  },
  {
    name: 'vitesse',
    display: 'Vitesse',
    shape: 'circle',
    link: 'https://github.com/antfu/vitesse',
    color: '#895',
    from: ['icones', 'unplugin-vue-components', 'unplugin-auto-import', 'vite-pwa', 'unplugin-icons'],
    deps: ['vueuse'],
  },
  {
    name: 'vitesse-theme',
    link: 'https://github.com/antfu/vscode-theme-vitesse',
    color: '#895',
    from: ['vitesse', 'vueuse'],
  },
  {
    name: 'vitesse-webext',
    link: 'https://github.com/antfu/vitesse-webext',
    color: '#895',
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
    color: '#00c58e',
    from: ['vitesse'],
  },
  {
    name: 'vitesse-nuxt3',
    link: 'https://github.com/antfu/vitesse-nuxt3',
    color: '#895',
    from: ['vitesse', 'nuxt'],
  },
  {
    name: 'unplugin',
    link: 'https://github.com/unjs/unplugin',
    color: '#982',
    from: ['nuxt'],
    deps: ['unplugin-icons', 'unplugin-auto-import', 'unplugin-vue-components'],
  },
  {
    name: 'unimport',
    link: 'https://github.com/unjs/unimport',
    color: '#982',
    from: ['nuxt', 'unplugin-auto-import'],
  },
  {
    name: 'vite-node',
    link: 'https://github.com/vitest-dev/vitest/tree/main/packages/vite-node',
    color: '#bd3',
    from: ['nuxt', 'vite'],
  },
  {
    name: 'vitest',
    display: 'Vitest',
    shape: 'circle',
    link: 'https://github.com/vitest-dev/vitest',
    color: '#bd3',
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
    from: ['nuxt', 'vite-plugin-inspect'],
    deps: ['birpc'],
  },
  {
    name: 'magicast',
    link: 'https://github.com/unjs/magicast',
    color: '#982',
    from: ['nuxt-devtools'],
    deps: ['nuxt'],
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
    color: '#055',
    from: ['nuxt', 'antfu.me', 'slidev'],
  },
  {
    name: 'shiki-magic-move',
    link: 'https://github.com/shikijs/shiki-magic-move',
    color: '#055',
    from: ['shiki', 'slidev'],
  },
  {
    name: 'shiki/monaco',
    link: 'https://github.com/shikijs/shiki',
    color: '#055',
    from: ['learn.nuxt.com', 'shiki'],
  },
  {
    name: 'twoslash',
    display: 'Twoslash',
    link: 'https://github.com/twoslashes/twoslash',
    color: '#055',
    dashed: true,
    from: ['shiki'],
  },
  {
    name: '@antfu/eslint-config',
    link: 'https://github.com/antfu/eslint-config',
    color: '#53f',
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
    link: 'https://github.com/eslint/config-inspector',
    color: '#53f',
    from: ['@antfu/eslint-config', 'nuxt-devtools'],
  },
  {
    name: 'eslint-plugin-format',
    link: 'https://github.com/antfu/eslint-plugin-format',
    color: '#53f',
    from: ['@antfu/eslint-config'],
  },
  {
    name: 'eslint-plugin-command',
    link: 'https://github.com/antfu/eslint-plugin-command',
    color: '#53f',
    animateStop: false,
    from: ['@antfu/eslint-config'],
  },
  {
    name: 'eslint-flat-config-utils',
    link: 'https://github.com/antfu/eslint-flat-config-utils',
    color: '#53f',
    animateStop: false,
    from: ['@antfu/eslint-config'],
  },
  {
    name: 'eslint-typegen',
    link: 'https://github.com/antfu/eslint-typegen',
    color: '#53f',
    animateStop: false,
    from: ['@antfu/eslint-config'],
  },
  {
    name: '@nuxt/eslint',
    display: 'Nuxt ESLint',
    link: 'https://github.com/nuxt/eslint',
    color: '#00c58e',
    from: ['nuxt', 'eslint-typegen', '@eslint/config-inspector'],
  },
]

export const secondaries: ProjectNode[] = [
]

for (const [id, pos] of Object.entries(poisitions) as [string, { x: number, y: number }][]) {
  if (!pos)
    continue
  const project = projects.find(p => p.name === id) || secondaries.find(p => p.name === id)
  if (project)
    Object.assign(project, pos)
}

export {
  poisitions,
}
