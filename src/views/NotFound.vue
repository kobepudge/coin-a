<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="text-6xl mb-4">🔍</div>
      <h1 class="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <h2 class="text-xl font-semibold text-gray-700 mb-4">页面未找到</h2>
      <p class="text-gray-600 mb-8 max-w-md">
        抱歉，您访问的页面不存在或已被移除。请检查网址是否正确，或返回管理面板。
      </p>
      <div class="space-x-4">
        <router-link
          to="/admin/dashboard"
          class="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          返回管理面板
        </router-link>
        <button
          @click="$router.go(-1)"
          class="inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404页面
</script>
