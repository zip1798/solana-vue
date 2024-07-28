<template>
  <!-- interaction with counter program -->
  <div class="bg-white shadow sm:rounded-lg my-8">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Interaction with counter program</h3>
      <div class="mt-2 max-w-xl text-sm text-gray-500">
        <p></p>
      </div>
      <form class="mt-5 sm:flex sm:items-center">
        <btn  :loading="loading_initialize" @click="initialize" class="ml-3" >Initialize</btn>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// import { Transaction, PublicKey  } from '@solana/web3.js';
import Btn from '../global/Btn.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import * as CounterProgram from '../../solana/anchor/counter';


let loading_initialize = ref(false);


async function initialize() {
  try {
    const newAccount = CounterProgram.generateNewKeypair();

    loading_initialize.value = true
    const result = await CounterProgram.initialize(newAccount)
    console.log(result)    
    toast.success(result.txSig);
    
  } catch(error) {
    toast.error(String(error))
  }

  loading_initialize.value = false;
}

</script>