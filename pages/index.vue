<script setup lang="ts">
import { DataSet } from 'vis-data'
import type { Node } from 'vis-network'
import { Network } from 'vis-network'
import chroma from 'chroma-js'

const container = ref<HTMLDivElement>()

interface ProjectNode extends Partial<Node> {
  name: string
  display?: string
  link: string
  color?: string
  dashed?: boolean
  yaks?: string[]
  usedBy?: string[]
}

const projects: ProjectNode[] = [
  {
    name: 'breadsplit',
    display: 'BreakSplit',
    link: 'https://github.com/breadsplit/breadsplit',
    yaks: ['i18n-ally', 'vueuse'],
    color: '#555',
  },
  {
    name: 'i18n-ally',
    display: 'i18n Ally',
    link: 'https://github.com/lokalise/i18n-ally',
    color: '#351',
  },
  {
    name: 'vueuse',
    display: 'VueUse',
    link: 'https://github.com/vueuse/vueuse',
    yaks: ['@vue/composition-api', 'vue-demi', 'icones', 'slidev'],
    shape: 'circle',
    color: '#42b883',
  },
  {
    name: 'vue-demi',
    display: 'VueDemi',
    link: 'https://github.com/vueuse/vue-demi',
    color: '#42b883',
  },
  {
    name: '@vue/composition-api',
    link: 'https://github.com/vuejs/composition-api',
    color: '#42b883',
    yaks: ['vue', 'vue-demi'],
  },
  {
    name: 'vue',
    display: 'Vue 3',
    link: 'https://github.com/vuejs/core',
    color: '#42b883',
    dashed: true,
    yaks: ['vite', 'icones'],
  },
  {
    name: 'vite',
    display: 'Vite',
    link: 'https://github.com/vitejs/vite',
    color: '#454ce1',
    dashed: true,
    yaks: ['icones', 'slidev', 'vitest'],
  },
  {
    name: 'icones',
    display: 'Icones',
    link: 'https://github.com/antfu/icones',
    color: '#834',
    shape: 'circle',
    yaks: ['iconify', 'unplugin-icons', 'unplugin-vue-components', 'unplugin-auto-import', 'vite-pwa'],
  },
  {
    name: 'unplugin-icons',
    link: 'https://github.com/unplugin/unplugin-icons',
    color: '#525',
    yaks: ['vitesse'],
  },
  {
    name: 'iconify',
    display: 'Iconify',
    link: 'https://iconify.design/',
    dashed: true,
    usedBy: ['unplugin-icons'],
  },
  {
    name: 'unplugin-vue-components',
    link: 'https://github.com/unplugin/unplugin-vue-components',
    color: '#525',
    yaks: ['vitesse', 'vite-plugin-inspect'],
  },
  {
    name: 'unplugin-auto-import',
    link: 'https://github.com/unplugin/unplugin-auto-import',
    color: '#525',
    yaks: ['vitesse'],
  },
  {
    name: 'vite-pwa',
    link: 'https://github.com/vite-pwa',
    color: '#525',
  },
  {
    name: 'vite-plugin-inspect',
    link: 'https://github.com/antfu-collective/vite-plugin-inspect',
    color: '#454ce1',
    yaks: ['nuxt-devtools'],
  },
  {
    name: 'vitesse',
    link: 'https://github.com/antfu/vitesse',
    color: '#525',
    yaks: ['antfu.me', 'windicss', 'slidev', 'nuxt'],
  },
  {
    name: 'antfu.me',
    link: 'https://antfu.me',
    color: '#459',
    yaks: ['vite-ssg', 'shiki'],
  },
  {
    name: 'vite-ssg',
    link: 'https://github.com/antfu/vite-ssg',
    color: '#459',
    usedBy: ['vitesse'],
  },
  {
    name: 'windicss',
    display: 'Windi CSS',
    link: 'https://github.com/windicss/windicss',
    color: '#09f',
    dashed: true,
    yaks: ['slidev', 'unocss'],
  },
  {
    name: 'slidev',
    display: 'Slidev',
    link: 'https://github.com/slidevjs/slidev',
    color: '#2ae',
    shape: 'circle',
    yaks: ['broz', 'unocss', 'shiki'],
  },
  {
    name: 'broz',
    link: 'https://github.com/antfu/broz',
    color: '#123',
  },
  {
    name: 'unocss',
    display: 'UnoCSS',
    link: 'https://github.com/unocss/unocss',
    color: '#123',
  },
  {
    name: 'nuxt',
    display: 'Nuxt',
    link: 'https://github.com/nuxt/nuxt',
    dashed: true,
    color: '#00c58e',
    yaks: ['vite-node', 'unplugin', 'shiki', 'nuxt-devtools'],
  },
  {
    name: 'nuxt-devtools',
    display: 'Nuxt DevTools',
    link: 'https://github.com/nuxt/devtools',
    color: '#00c58e',
  },
  {
    name: 'vite-node',
    link: 'https://github.com/vitest-dev/vitest/tree/main/packages/vite-node',
    color: '#454ce1',
    yaks: ['vitest'],
  },
  {
    name: 'vitest',
    display: 'Vitest',
    shape: 'circle',
    link: 'https://github.com/vitest-dev/vitest',
    color: '#493',
    yaks: ['birpc'],
  },
  {
    name: 'birpc',
    link: 'https://github.com/antfu/birpc',
    color: '#493',
    usedBy: ['nuxt-devtools'],
  },
  {
    name: 'unplugin',
    display: 'Unplugin',
    link: 'https://github.com/unjs/unplugin',
    color: '#525',
    usedBy: ['unplugin-vue-components', 'unplugin-icons', 'unplugin-auto-import'],
  },
  {
    name: 'shiki',
    display: 'Shiki',
    link: 'https://github.com/shikijs/shiki',
    dashed: true,
    color: '#245',
  },
  {
    name: '@antfu/eslint-config',
    link: 'https://github.com/antfu/eslint-config',
    color: '#53f',
    yaks: ['eslint-flat-config-utils', 'eslint-typegen', '@nuxt/eslint', 'eslint-stylistic'],
  },
  {
    name: 'eslint-flat-config-utils',
    link: 'https://github.com/antfu/eslint-flat-config-utils',
    color: '#53f',
  },
  {
    name: 'eslint-typegen',
    link: 'https://github.com/antfu/eslint-typegen',
    color: '#53f',
  },
  {
    name: '@nuxt/eslint',
    link: 'https://github.com/nuxt/eslint',
    color: '#53f',
  },
  {
    name: 'eslint-stylistic',
    display: 'ESLint Stylistic',
    link: 'https://github.com/eslint-stylistic/eslint-stylistic',
    color: '#59f',
  },
]

onMounted(() => {
  // create an array with nodes
  const nodes = new DataSet(projects.map((project) => {
    const color = chroma(project.color || '#333')
    const [_l, c, h] = color.oklch()

    return {
      id: project.name,
      label: project.display || project.name,
      ...project,
      ...project.dashed
        ? {
            shapeProperties: { borderDashes: [2, 2] },
          }
        : {},
      font: {
        color: chroma.oklch(0.7, c, h).hex(),
      },
      color: {
        border: chroma.oklch(0.7, c, h).mix('#050505', project.dashed ? 0.8 : 0.5).hex(),
        background: chroma.oklch(0.7, c, h).mix('#050505', project.dashed ? 0.96 : 0.95).hex(),
        highlight: {
          border: chroma.oklch(0.7, c, h).mix('#050505', project.dashed ? 0.8 : 0.5).hex(),
          background: chroma.oklch(0.7, c, h).mix('#050505', 0.9).hex(),
        },
      },
    }
  }))

  const edges = new DataSet(
    projects.flatMap(project => [
      ...(project.yaks || []).map(yak => ({
        id: `${project.name}-${yak}`,
        from: project.name,
        to: yak,
        arrows: {
          to: {
            enabled: true,
            type: 'arrow',
          },
        },
      })),
      ...(project.usedBy || []).map(related => ({
        id: `${project.name}-${related}`,
        from: project.name,
        to: related,
        dashes: [3, 3],
        physics: false,
        arrows: {
          to: {
            enabled: true,
            type: 'vee',
          },
        },
      })),
    ]),
  )

  // create a network
  const data = {
    nodes,
    edges,
  }
  const _network = new Network(container.value!, data, {
    layout: {
      // hierarchical: {
      //   enabled: true,
      // },
    },
    nodes: {
      shape: 'box',
      margin: {
        top: 10,
        right: 10,
        bottom: 8,
        left: 10,
      },
    },
  })
})
</script>

<template>
  <div ref="container" h-full w-full>
    Hello
  </div>
</template>

<style>
html {
  color-scheme: dark;
  background: #050505;
}
</style>
