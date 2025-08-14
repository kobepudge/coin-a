<template>
  <div 
    class="responsive-grid"
    :class="[
      gapClass,
      gridClass
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  cols?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  cols: () => ({ xs: 1, sm: 2, md: 3, lg: 4 }),
  gap: 'md'
})

const gapClass = computed(() => {
  const gapMap = {
    xs: 'gap-1',
    sm: 'gap-2', 
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
  return gapMap[props.gap]
})

const gridClass = computed(() => {
  const classes = ['grid']
  
  if (props.cols.xs) classes.push(`grid-cols-${props.cols.xs}`)
  if (props.cols.sm) classes.push(`sm:grid-cols-${props.cols.sm}`)
  if (props.cols.md) classes.push(`md:grid-cols-${props.cols.md}`)
  if (props.cols.lg) classes.push(`lg:grid-cols-${props.cols.lg}`)
  if (props.cols.xl) classes.push(`xl:grid-cols-${props.cols.xl}`)
  
  return classes.join(' ')
})
</script>

<style scoped>
.responsive-grid {
  width: 100%;
}
</style>
