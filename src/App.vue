<template>
  <div class="min-h-full">

    <Header />

    <div class="py-10">
      <header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">{{ pageTitleFromRoute }}</h1>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <!-- Replace with your content -->
          <router-view />
          <!-- /End replace -->
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './components/global/Header.vue'
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const pageTitleFromRoute = computed(() => {
  return router.currentRoute.value.name;
})

</script>

<style scoped>
</style>
