<template>
<div class="bg-white shadow sm:rounded-lg my-8">
    <div class="px-4 py-5 sm:p-6">

      <form>

        <div class="my-4">
            <TextInputField 
            v-model="title" 
            id="title"
            name="title"
            title="Title of Movie" 
            :is-valid="isValidTitle" 
            text-error="Not a valid title." />
        </div>
        <div class="my-4">
            <TextInputField 
            v-model="description" 
            id="description"
            name="description"
            title="Description of Movie" 
            :is-valid="isValidDescription" 
            text-error="Not a valid description." />
        </div>

        <div>
          <label class="text-base font-medium text-gray-900">Rating</label>
          <fieldset class="mt-4">
            <legend class="sr-only">Notification method</legend>
            <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
              <div v-for="ratingOption in ratingOptions" :key="ratingOption.id" class="flex items-center">
                <input :id="ratingOption.id" :value="ratingOption.id" v-model="rating" name="rating" type="radio" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <label :for="ratingOption.id" class="ml-3 block text-sm font-medium text-gray-700">{{ ratingOption.title }}</label>
              </div>
            </div>
          </fieldset>
        </div>


        <btn :loading="loading_send_tx" @click="sendTx" class="ml-3 mt-5" >Send Transaction {{ rating }}</btn>

      </form>
    </div>
  </div>
  

</template>

<script setup lang="ts">
import { ref } from 'vue'
import Btn from '../global/Btn.vue';
import TextInputField from '../global/TextInputField.vue';
import { createMovieReview } from '../../solana/system/movie_review';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

let title = ref("");
let description = ref("");
let rating = ref("3");
let loading_send_tx = ref(false);
let isValidTitle = ref(true);
let isValidDescription = ref(true);

const ratingOptions = [
  { id: '1', title: '1' },
  { id: '2', title: '2' },
  { id: '3', title: '3' },
  { id: '4', title: '4' },
  { id: '5', title: '5' },
]

async function sendTx() {
  try {
    loading_send_tx.value = true;
    const txid = await createMovieReview(title.value, description.value, parseInt(rating.value));
    toast.success(String(txid))
  } catch (e) {
    toast.error(String(e))
  }
  loading_send_tx.value = false;
} 

</script>