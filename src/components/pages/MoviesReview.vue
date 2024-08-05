<template>
    <router-link
        to="/add_movie_review"
        custom
        v-slot="{ navigate, href, isActive }"
    >
        <btn @click="navigate" :href="href" class="ml-3 mt-5" >Add Moview Review</btn>

    </router-link>
    
    <btn @click="load" class="ml-3 mt-5" >Load</btn>

    <!-- MovieCard v-for="movie in list" :key="movie.title" :movie="movie"></MovieCard -->
    
    <template v-for="movie in movies" :key="movie?.title">
        <MovieCard  v-if="movie !== null" :movie="movie"></MovieCard>
    </template>


    <nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-3">
    <div class="-mt-px flex w-0 flex-1">
      <a href="#" class="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        <ArrowLongLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        Previous
      </a>
    </div>
    <div class="hidden md:-mt-px md:flex">
      <a href="#" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">1</a>
      <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" -->
      <a href="#" class="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600" aria-current="page">2</a>
      <a href="#" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">3</a>
      <span class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">...</span>
      <a href="#" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">8</a>
      <a href="#" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">9</a>
      <a href="#" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">10</a>
    </div>
    <div class="-mt-px flex w-0 flex-1 justify-end">
      <a href="#" class="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        Next
        <ArrowLongRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
      </a>
    </div>
  </nav>

</template>

<script setup lang="ts">
import Btn from '../global/Btn.vue';
import { Movie } from '../../models/Movie';
import MovieCard from '../movie/movie.vue'
import { MovieRepository } from '../../solana/system/movie_review';
import { computed, ref, onMounted } from 'vue';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/20/solid'

let movies = ref<(Movie|null)[]>([]);

onMounted(async () => {
    setTimeout(async () => {
        movies.value = await MovieRepository.loadMovieReviews()    
    }, 1000)
})

const list = computed(() => {
    let result: Movie[] = []
    Movie.mocks.forEach(movie => {
        result.push(new Movie(movie.title, movie.rating, movie.description))
    })

    return result;
})

async function load() {
    movies.value = await MovieRepository.loadMovieReviews()
}
</script>