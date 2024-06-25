<script setup lang="ts">
import { DataSet } from 'vis-data'
import type { Node } from 'vis-network'
import { Network } from 'vis-network'
import chroma from 'chroma-js'
import { type ProjectNode, projects } from '~/data'
import poisitions from '~/yak-map-pos.json'

const container = ref<HTMLDivElement>()

function toNode(project: ProjectNode) {
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
}

onMounted(() => {
  // create an array with nodes
  const nodes = new DataSet(projects.map(project => toNode(project)))

  const edges = new DataSet(
    projects.flatMap((project) => {
      const color = chroma(project.color || '#333')
      const [_l, c, h] = color.oklch()

      return [
        ...(project.from || []).map(from => ({
          id: `${project.name}-${from}`,
          from,
          to: project.name,
          color: chroma.oklch(0.7, c, h).mix('#050505', 0.8).hex(),
          arrows: {
            to: {
              enabled: true,
              type: 'arrow',
            },
          },
        })),
        ...(project.deps || []).map(dep => ({
          id: `${project.name}-${dep}`,
          from: dep,
          to: project.name,
          color: chroma.oklch(0.7, c, h).mix('#050505', 0.95).hex(),
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
    }),
  )

  for (const [id, pos] of Object.entries(poisitions) as [string, { x: number, y: number }][]) {
    if (pos)
      nodes.update({ id, x: pos.x, y: pos.y })
  }

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
    },
  )

  if (import.meta.hot) {
    function save() {
      import.meta.hot?.send('yak-map-pos', network.getPositions())
    }

    network.on('stabilized', () => save())
    network.on('dragEnd', () => save())
  }
})
</script>

<template>
  <div>
    <div ref="container" h-screen w-screen outline-none />
    <div fixed left-5 top-5 flex="~ items-center gap-3">
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
  </div>
</template>

<style>
html {
  color-scheme: dark;
  background: #050505;
}
</style>
