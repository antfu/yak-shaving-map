<script setup lang="ts">
import { DataSet } from 'vis-data'
import { Network } from 'vis-network'
import chroma from 'chroma-js'
import { type ProjectNode, projects } from '~/data'
import poisitions from '~/yak-map-pos.json'

const isDark = useDark()

function toggleDark() {
  isDark.value = !isDark.value
}

const container = ref<HTMLDivElement>()

const backgroundColor = computed(() => isDark.value ? '#050505' : '#ffff')
const luminance = computed(() => isDark.value ? 0.7 : 0.6)

function toNode(project: ProjectNode, focus = false) {
  const color = chroma(project.color || '#888')
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
      color: chroma.oklch(luminance.value, c, h).hex(),
    },
    color: {
      border: chroma.oklch(luminance.value, c, h).mix(backgroundColor.value, project.dashed ? 0.8 : 0.5).hex(),
      background: chroma.oklch(luminance.value, c, h).mix(backgroundColor.value, project.dashed ? 0.96 : 0.95).hex(),
      highlight: {
        border: chroma.oklch(luminance.value, c, h).mix(backgroundColor.value, project.dashed ? 0.8 : 0.5).hex(),
        background: chroma.oklch(luminance.value, c, h).mix(backgroundColor.value, 0.9).hex(),
      },
    },
    borderWidth: focus ? 4 : 1,
  }
}

function toEdges(project: ProjectNode) {
  const color = chroma(project.color || '#333')
  const [_l, c, h] = color.oklch()

  return [
    ...(project.from || []).map(from => ({
      id: `${project.name}|${from}`,
      from,
      to: project.name,
      color: chroma.oklch(luminance.value, c, h).mix(backgroundColor.value, 0.8).hex(),
      arrows: {
        to: {
          enabled: true,
          type: 'arrow',
        },
      },
    })),
    ...(project.deps || []).map(dep => ({
      id: `${project.name}|${dep}`,
      from: dep,
      to: project.name,
      color: chroma.oklch(luminance.value, c, h).mix(backgroundColor.value, 0.95).hex(),
      dashes: [3, 3],
      physics: false,
      // arrows: {
      //   to: {
      //     enabled: true,
      //     type: 'vee',
      //   },
      // },
    })),
  ]
}

for (const [id, pos] of Object.entries(poisitions) as [string, { x: number, y: number }][]) {
  const project = projects.find(p => p.name === id)
  if (!project || !pos)
    continue
  Object.assign(project, pos)
}

const query = useUrlSearchParams('history', { initialValue: { count: 1 } })

onMounted(() => {
  const nodes = new DataSet(projects.slice(0, query.count).map(project => toNode(project)))
  const edges = new DataSet(projects.slice(0, query.count).flatMap(project => toEdges(project)))

  // create a network
  const network = new Network(
    container.value!,
    {
      nodes,
      edges,
    },
    {
      nodes: {
        shape: 'box',
        margin: {
          top: 10,
          right: 10,
          bottom: 8,
          left: 10,
        },
      },
      edges: {
        smooth: {
          enabled: true,
          type: 'discrete',
          roundness: 0.5,
        },
      },
      physics: {
        enabled: false,
      },
      interaction: {
        dragNodes: false,
        dragView: false,
        selectable: false,
        zoomView: false,
      },
    },
  )

  if (import.meta.hot) {
    function save() {
      import.meta.hot?.send('yak-map-pos', Object.assign({}, poisitions, network.getPositions()))
    }

    network.on('stabilized', () => save())
    network.on('dragEnd', () => save())
  }

  network.focus(projects[0].name, { scale: 2 })

  let loop = 0
  watchEffect(() => {
    const visible = projects.slice(0, query.count)
    nodes.update(visible.map((project, idx) => toNode(project, idx === query.count - 1)))
    edges.update(visible.slice(0, query.count).flatMap(project => toEdges(project)))

    nodes.remove(nodes.getIds().filter(id => !visible.some(p => p.name === id)))
    edges.remove(edges.getIds().filter(id => !visible.some(p => (id as string).startsWith(`${p.name}|`))))

    if (query.count >= projects.length) {
      network.fit({ animation: !!loop })
      if (import.meta.hot) {
        network.setOptions({
          interaction: {
            dragNodes: true,
            dragView: true,
            selectable: true,
            zoomView: true,
          },
        })
      }
    }
    else {
      network.focus(projects[query.count - 1].name, { scale: 2, animation: !!loop })
      network.setOptions({
        interaction: {
          dragNodes: false,
          dragView: false,
          selectable: false,
          zoomView: false,
        },
      })
    }
    loop += 1
  })
})
</script>

<template>
  <div>
    <div ref="container" h-screen w-screen outline-none />
    <div flex="~ items-center gap-3" fixed left-0 top-0 rounded-br-2rem p5 backdrop-blur-md>
      <div text-5xl>
        🐃
      </div>
      <div>
        <a href="https://antfu.me" text-sm op50 hover:underline target="_blank">Anthony Fu's</a>
        <div text-2xl>
          Yak Map
        </div>
      </div>
    </div>
    <div flex="~ items-center gap-3" fixed right-4 top-4 rounded-1rem p2 backdrop-blur-md>
      <button rounded-xl p3 hover:bg-gray:10 @click="toggleDark()">
        <div i-ph-sun-duotone dark:i-ph-moon-duotone />
      </button>
    </div>
    <div fixed bottom-0 left-0 right-0 p4 flex="~ col items-center gap-3">
      <div>{{ query.count }}/{{ projects.length }}</div>
      <input v-model="query.count" type="range" min="1" :max="projects.length" w-full>
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
