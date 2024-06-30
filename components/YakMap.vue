<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { DataSet } from 'vis-data'
import { Network } from 'vis-network'
import chroma from 'chroma-js'
import type { ProjectNode } from '../data'
import * as DATA from '../data'

const props = withDefaults(
  defineProps<{
    isEditing?: boolean
    isDark?: boolean
    showSecondary?: boolean
    mode?: 'steps' | 'all'
    onEdit?: (data: any) => void
    focusScale?: number
    backgroundColor?: string
  }>(),
  {
    isEditing: false,
    isDark: true,
    showSecondary: false,
    mode: 'all',
    focusScale: 1.5,
  },
)
const clicks = defineModel('clicks', { default: 1, type: Number })

const container = ref<HTMLDivElement>()

const collection = computed(() => props.showSecondary ? DATA.all : DATA.primary)
const backgroundColor = computed(() => props.backgroundColor || (props.isDark ? '#050505' : '#ffff'))
const luminance = computed(() => props.isDark ? 0.7 : 0.6)

function toNode(project: ProjectNode, focus = false) {
  const color = chroma(project.color || '#888')
  const [_l, c, h] = color.oklch()

  const getColor = (opacity = 1) => chroma
    .oklch(luminance.value, c, h)
    .mix(backgroundColor.value, 1 - opacity)
    .hex()

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
      color: getColor(project.faded ? 0.75 : 1),
    },
    color: {
      border: getColor(project.faded ? 0.05 : project.dashed ? 0.2 : 0.5),
      background: getColor(project.faded ? 0.02 : project.dashed ? 0.05 : 0.05),
      highlight: {
        border: getColor((project.dashed || project.faded) ? 0.2 : 0.5),
        background: getColor(0.1),
      },
      hover: {
        border: getColor((project.dashed || project.faded) ? 0.2 : 0.5),
        background: getColor(0.07),
      },
    },
    borderWidth: focus ? 4 : 1,
    borderWidthSelected: focus ? 4 : 2,
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
  clicks.value = Math.min(+clicks.value + 1, DATA.primary.length)
}

function prev() {
  clicks.value = Math.max(+clicks.value - 1, 1)
}

const animationStops = computed(() => collection.value.filter(p => p.animateStop !== false))

defineExpose({
  next,
  prev,
  count: computed(() => collection.value.length),
  stops: computed(() => animationStops.value.length),
})

function getCurrentItems() {
  if (props.mode === 'all')
    return collection.value
  const list: ProjectNode[] = []
  let count = 0
  for (const item of collection.value) {
    if (item.animateStop !== false)
      count += 1
    if (count > +clicks.value)
      break
    list.push(item)
  }
  return list
}

onMounted(() => {
  const items = getCurrentItems()
  const nodes = new DataSet(items.map(item => toNode(item)))
  const edges = new DataSet(items.flatMap(item => toEdges(item)))

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
        width: 1,
        hoverWidth: 0,
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
      props.onEdit?.(Object.assign({}, DATA.poisitions, network.getPositions()))
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
      const project = collection.value.find(p => p.name === arg.nodes[0])
      if (project?.link)
        window.open(project.link, '_blank')
    }
  })

  network.on('hoverNode', () => {
    if (container.value)
      container.value.style.cursor = 'pointer'
  })
  network.on('blurNode', () => {
    if (container.value)
      container.value.style.cursor = 'default'
  })

  watchEffect(() => {
    network.setOptions({
      interaction: {
        dragNodes: !!props.isEditing,
        hover: true,
      },
    })
  })

  let initiated = 0
  watchEffect(() => {
    const items = getCurrentItems()

    nodes.update(items.map((item, idx) => toNode(item, props.mode === 'steps' && idx === items.length - 1)))
    edges.update(items.flatMap(item => toEdges(item)))

    nodes.remove(nodes.getIds().filter(id => !items.some(p => p.name === id)))
    edges.remove(edges.getIds().filter(id => !items.some(p => (id as string).startsWith(`${p.name}|`))))

    // Fit all nodes
    if (items.length >= DATA.primary.length || props.mode === 'all') {
      // Reset previous animation, so it moves smoothly
      network.moveTo({ position: network.getViewPosition(), scale: network.getScale() })
      network.fit({
        animation: initiated
          ? {
              duration: 1500,
              easingFunction: 'easeInOutQuad',
            }
          : undefined,
      })
    }
    // Focus on the last node
    else {
      const node = items[items.length - 1]
      if (node) {
        const viewPos = network.getViewPosition()
        const distance = Math.sqrt((viewPos.x - node.x!) ** 2 + (viewPos.y - node.y!) ** 2)
        if (distance > 200 || !initiated || +clicks.value === 1) {
          // Reset previous animation, so it moves smoothly
          network.moveTo({ position: network.getViewPosition(), scale: network.getScale() })
          // Focus on the node
          network.focus(
            node.name,
            {
              scale: props.focusScale,
              animation: initiated
                ? {
                    duration: 600 + distance * 2,
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
