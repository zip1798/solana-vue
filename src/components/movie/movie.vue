<template>
  <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
    <h3 class="text-lg font-medium leading-6 text-gray-900">{{movie?.title}} / {{movie?.rating}}</h3>
    <p class="mt-1 text-sm text-gray-500">{{movie?.description}}</p>
</div>
</template>

<script setup lang="ts">
import { Movie } from '../../models/Movie';

defineProps({
  movie: Movie 
})
</script>