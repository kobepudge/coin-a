<template>
  <div class="responsive-layout">
    <div class="container mx-auto px-4 py-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// 响应式布局组件
</script>

<style scoped>
.responsive-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
}

@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
