// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt()
  .append(antfu(
    {
      unocss: true,
      formatters: true,
    },
  ))
  .prepend({
    ignores: ['yak-map-pos.json'],
  })
