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

    <Paginator 
        :page="page" 
        :total-pages="totalPages" 
        @go-previous-page="prev" 
        @go-next-page="next"
        @go-to-page="goToPage"
      ></Paginator>

</template>

<script setup lang="ts">
import Btn from '../global/Btn.vue';
import Paginator from '../global/Paginator.vue';
import { Movie } from '../../models/Movie';
import MovieCard from '../movie/movie.vue'
import { MovieRepository } from '../../solana/system/movie_review';
import { computed, ref, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

let movies = ref<(Movie|null)[]>([]);

const page = ref(1);
const totalPages = ref(1);
const recordsPerPage = ref(10);

onMounted(async () => {
    setTimeout(async () => {
        const accounts = await MovieRepository.prefechAccounts()
        totalPages.value = Math.ceil(accounts.length / recordsPerPage.value)
        movies.value = await MovieRepository.fetchPage(page.value, recordsPerPage.value)    
    }, 1000)
})

watch(page, async (newPage) => {
    movies.value = await MovieRepository.fetchPage(newPage, recordsPerPage.value)
})

// const list = computed(() => {
//     let result: Movie[] = []
//     Movie.mocks.forEach(movie => {
//         result.push(new Movie(movie.title, movie.rating, movie.description))
//     })

//     return result;
// })

async function load() {
    movies.value = await MovieRepository.loadMovieReviews()
}

async function prev() {
  page.value -= 1
}

async function next() {
  page.value += 1
}

async function goToPage(pg: number) {
  page.value = pg
}


</script>