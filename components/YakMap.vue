<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { DataSet } from 'vis-data'
import { Network } from 'vis-network'
import chroma from 'chroma-js'
import type { ProjectNode } from '../data'
import { poisitions, projects } from '../data'

const props = withDefaults(
  defineProps<{
    isEditing?: boolean
    isDark?: boolean
    mode?: 'steps' | 'all'
    onEdit?: (data: any) => void
    focusScale?: number
  }>(),
  {
    isEditing: false,
    isDark: true,
    mode: 'all',
    focusScale: 1.5,
  },
)

const clicks = defineModel('clicks', { default: 1, type: Number })

const container = ref<HTMLDivElement>()

const backgroundColor = computed(() => props.isDark ? '#050505' : '#ffff')
const luminance = computed(() => props.isDark ? 0.7 : 0.6)

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
    })),
  ]
}

function next() {
  clicks.value = Math.min(+clicks.value + 1, projects.length)
}

function prev() {
  clicks.value = Math.max(+clicks.value - 1, 1)
}

defineExpose({
  next,
  prev,
  count: computed(() => projects.length),
})

onMounted(() => {
  const nodes = new DataSet(projects.slice(0, +clicks.value).map(project => toNode(project)))
  const edges = new DataSet(projects.slice(0, +clicks.value).flatMap(project => toEdges(project)))

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

  function save() {
    if (props.isEditing)
      props.onEdit?.(Object.assign({}, poisitions, network.getPositions()))
  }

  network.on('stabilized', () => save())
  network.on('dragEnd', () => save())

  network.on('click', (arg: { nodes: string[], pointer: { canvas: { x: number, y: number } } }) => {
    if (props.isEditing)
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

  watchEffect(() => {
    network.setOptions({
      interaction: {
        dragNodes: !!props.isEditing,
      },
    })
  })

  let initiated = 0
  watchEffect(() => {
    const visible = props.mode === 'steps'
      ? projects.slice(0, +clicks.value)
      : projects
    nodes.update(visible.map((project, idx) => toNode(project, props.mode === 'steps' && idx === +clicks.value - 1)))
    edges.update(visible.flatMap(project => toEdges(project)))

    nodes.remove(nodes.getIds().filter(id => !visible.some(p => p.name === id)))
    edges.remove(edges.getIds().filter(id => !visible.some(p => (id as string).startsWith(`${p.name}|`))))

    if (+clicks.value >= projects.length || props.mode === 'all') {
      network.fit({ animation: initiated
        ? {
            duration: 2000,
            easingFunction: 'easeInOutQuad',
          }
        : undefined,
      })
    }
    else {
      const node = projects[+clicks.value - 1]
      if (node) {
        const viewPos = network.getViewPosition()
        const distance = Math.sqrt((viewPos.x - node.x!) ** 2 + (viewPos.y - node.y!) ** 2)
        if (distance > 200 || !initiated || +clicks.value === 1) {
          network.focus(
            node.name,
            {
              scale: props.focusScale,
              animation: initiated
                ? {
                    duration: 1000 + distance * 2,
                    easingFunction: 'easeInOutQuad',
                  }
                : false,
            },
          )
        }
      }
    }
    initiated += 1
  })
})
</script>

<template>
  <div ref="container" h-full w-full outline-none class="yak-map" />
</template>

<style>
.yak-map div,
.yak-map button {
  outline: none !important;
}
</style>
