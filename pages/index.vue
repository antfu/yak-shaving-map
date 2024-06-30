<script setup lang="ts">
import { onKeyStroke, useDark, useUrlSearchParams } from '@vueuse/core'
import { computed, shallowRef } from 'vue'
import YakMap from '../components/YakMap.vue'

const query = useUrlSearchParams('history', {
  initialValue: {
    clicks: 1,
    mode: 'all' as 'all' | 'steps',
    embedded: false,
  },
  removeFalsyValues: true,
  removeNullishValues: true,
})

const isEditing = computed(() => import.meta.hot && query.mode === 'all')
const isDark = useDark()

function toggleDark() {
  isDark.value = !isDark.value
}

onKeyStroke('ArrowRight', () => next())
onKeyStroke('ArrowLeft', () => prev())
onKeyStroke(' ', () => next())

function onEdit(data: any) {
  if (import.meta.hot)
    import.meta.hot.send('yak-map-pos', data)
}

const map = shallowRef<InstanceType<typeof YakMap>>()

function next() {
  map.value?.next()
}

function prev() {
  map.value?.prev()
}
</script>

<template>
  <div h-screen w-screen flex>
    <YakMap
      ref="map"
      v-model:clicks="query.clicks"
      :is-editing="isEditing"
      :is-dark="isDark"
      :mode="query.mode"
      @edit="onEdit"
    />
    <div flex="~ items-center gap-3" fixed left-0 top-0 rounded-br-2rem p5 backdrop-blur-md>
      <div text-5xl>
        🐃
      </div>
      <div flex="~ col">
        <a href="https://antfu.me" text-sm op50 hover:underline target="_blank">Anthony Fu's</a>
        <a text-2xl href="https://github.com/antfu/yak-shaving-map" target="_blank" hover:underline>
          Yak Map
        </a>
      </div>
    </div>
    <div v-if="!query.embedded" flex="~ items-center gap-0.5" fixed right-4 top-4 rounded-1rem p2 text-gray backdrop-blur-md>
      <button rounded-xl p3 hover:bg-gray:10 @click="toggleDark()">
        <div i-ph-sun-duotone dark:i-ph-moon-duotone />
      </button>
    </div>
    <div v-if="!query.embedded" flex="~ items-center gap-0.5" fixed bottom-4 right-4 z-100 rounded-1rem p2 text-gray backdrop-blur-md>
      <template v-if="query.mode === 'steps'">
        <button rounded-xl p3 hover:bg-gray:10 @click="prev()">
          <div i-ph-arrow-left-duotone />
        </button>
        <button rounded-xl p3 hover:bg-gray:10 @click="next()">
          <div i-ph-arrow-right-duotone />
        </button>
        <div border="l gray/10" mx2 h-20px w-1px />
        <button rounded-xl p3 pr4 hover:bg-gray:10 flex="~ items-center gap-2" @click="query.mode = 'all'">
          <div i-ph-graph-duotone />
          Show full graph
        </button>
      </template>
      <button
        v-else rounded-xl bg-gray:5 p3 pr4 hover:bg-gray:10 flex="~ items-center gap-2"
        @click="query.mode = 'steps';query.clicks = 1"
      >
        <div i-ph-play-duotone />
        Show steps
      </button>
    </div>
    <div v-if="query.mode === 'steps'" fixed bottom-0 left-0 right-0 z-100>
      <div h-1px :style="{ width: `${query.clicks / (map?.stops || 1) * 100}%` }" bg-teal />
    </div>
  </div>
</template>

<style>
.dark,
.dark body {
  color-scheme: dark;
  background: #050505;
}
</style>
