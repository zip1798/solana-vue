<template>
    <router-link
        to="/add_movie_review"
        custom
        v-slot="{ navigate, href, isActive }"
    >
        <btn @click="navigate" :href="href" class="ml-3 mt-5" >Add Moview Review</btn>

    </router-link>
    
    <btn @click="load" class="ml-3 mt-5" >Load</btn>

    <MovieCard v-for="movie in list" :key="movie.title" :movie="movie"></MovieCard>
    
    <template v-for="movie in movies" :key="movie?.title">
        <MovieCard  v-if="movie !== null" :movie="movie"></MovieCard>
    </template>

</template>

<script setup lang="ts">
import Btn from '../global/Btn.vue';
import { Movie } from '../../models/Movie';
import MovieCard from '../movie/movie.vue'
import { loadMovieReviews } from '../../solana/system/movie_review';
import { computed, ref } from 'vue';

let movies = ref<(Movie|null)[]>([]);

const list = computed(() => {
    let result: Movie[] = []
    Movie.mocks.forEach(movie => {
        result.push(new Movie(movie.title, movie.rating, movie.description))
    })

    return result;
})

async function load() {
    movies.value = await loadMovieReviews()
}
</script>