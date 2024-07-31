<template>
    <router-link
        to="/add_movie_review"
        custom
        v-slot="{ navigate, href, isActive }"
    >
        <btn @click="navigate" :href="href" class="ml-3 mt-5" >Add Moview Review</btn>
      
    </router-link>
</template>

<script setup lang="ts">
import Btn from '../global/Btn.vue';
</script>