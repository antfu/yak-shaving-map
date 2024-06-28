<script setup lang="ts">
import { DataSet } from 'vis-data'
import { Network, type Node } from 'vis-network'
import chroma from 'chroma-js'
import { type ProjectNode, projects } from '~/data'
import poisitions from '~/yak-map-pos.json'

const isDark = useDark()

function toggleDark() {
  isDark.value = !isDark.value
}

const container = ref<HTMLDivElement>()
const query = useUrlSearchParams('history', {
  initialValue: {
    count: 1,
    mode: 'all' as 'all' | 'steps',
    embedded: false,
  },
  removeFalsyValues: true,
  removeNullishValues: true,
})

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
    borderWidthSelected: focus ? 4 : 1,
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

function next() {
  query.count = Math.min(+query.count + 1, projects.length)
}

function prev() {
  query.count = Math.max(+query.count - 1, 1)
}

for (const [id, pos] of Object.entries(poisitions) as [string, { x: number, y: number }][]) {
  const project = projects.find(p => p.name === id)
  if (!project || !pos)
    continue
  Object.assign(project, pos)
}

const isEditing = ref(false)

onKeyStroke('ArrowRight', () => next())
onKeyStroke('ArrowLeft', () => prev())
onKeyStroke(' ', () => next())

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
        labelHighlightBold: false,
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
      },
    },
  )

  if (import.meta.hot) {
    function save() {
      if (isEditing.value)
        import.meta.hot!.send('yak-map-pos', Object.assign({}, poisitions, network.getPositions()))
    }

    network.on('stabilized', () => save())
    network.on('dragEnd', () => save())
  }

  network.on('click', (arg: { nodes: string[], pointer: { canvas: { x: number, y: number } } }) => {
    if (isEditing.value)
      return

    // Click on empty space
    if (!arg.nodes?.length) {
      if (arg.pointer.canvas.x < -30)
        prev()
      else if (arg.pointer.canvas.x > 30)
        next()
    }
    // Click on a node, open the link
    else if (arg.nodes.length === 1) {
      const project = projects.find(p => p.name === arg.nodes[0])
      if (project?.link)
        window.open(project.link, '_blank')
    }
  })

  let initiated = 0
  watchEffect(() => {
    const visible = query.mode === 'steps'
      ? projects.slice(0, query.count)
      : projects
    nodes.update(visible.map((project, idx) => toNode(project, query.mode === 'steps' && idx === query.count - 1)))
    edges.update(visible.flatMap(project => toEdges(project)))

    nodes.remove(nodes.getIds().filter(id => !visible.some(p => p.name === id)))
    edges.remove(edges.getIds().filter(id => !visible.some(p => (id as string).startsWith(`${p.name}|`))))

    if (query.count >= projects.length || query.mode === 'all') {
      network.fit({ animation: !!initiated })

      if (import.meta.hot && query.mode === 'all') {
        isEditing.value = true
        network.setOptions({
          interaction: {
            dragNodes: true,
          },
        })
      }
      else {
        isEditing.value = false
      }
    }
    else {
      isEditing.value = false
      const node = projects[query.count - 1]
      const viewPos = network.getViewPosition()
      const distance = Math.sqrt((viewPos.x - node.x!) ** 2 + (viewPos.y - node.y!) ** 2)
      if (distance > 150 || !initiated) {
        network.focus(
          node.name,
          {
            scale: 1.25,
            animation: initiated
              ? {
                  duration: 1000 + distance * 2,
                  easingFunction: 'easeInOutQuad',
                }
              : false,
          },
        )
      }
      network.setOptions({
        interaction: {
          dragNodes: false,
        },
      })
    }
    initiated += 1
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
      <button v-else rounded-xl bg-gray:5 p3 pr4 hover:bg-gray:10 flex="~ items-center gap-2" @click="query.mode = 'steps';query.count = 1">
        <div i-ph-play-duotone />
        Show steps
      </button>
    </div>
    <div v-if="query.mode === 'steps'" fixed bottom-0 left-0 right-0 z-100>
      <div h-1px :style="{ width: `${query.count / projects.length * 100}%` }" bg-teal />
    </div>
  </div>
</template>

<style>
.dark,
.dark body {
  color-scheme: dark;
  background: #050505;
}

div,
button {
  outline: none !important;
}
</style>
