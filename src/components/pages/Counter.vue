<template>
  <!-- interaction with counter program -->
  <div class="bg-white shadow sm:rounded-lg my-8">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        Interaction with counter program. 
        <span v-if="isInitialized">Account: {{ counterPubKey }}</span>
        <span v-if="isInitialized" class="text-red-500 text-weight-bold mx-3">Count: {{ count }}</span>
      </h3>
      <div class="mt-2 max-w-xl text-sm text-gray-500">
        <p></p>
      </div>
      <form class="mt-5 sm:flex sm:items-center">
        <btn  v-if="!isInitialized" :loading="loading_initialize" @click="initialize" class="ml-3" >Initialize</btn>

        <btn  v-if="isInitialized" :loading="loading_increment" @click="increment" class="ml-3" >Increment</btn>
        <btn  v-if="isInitialized" :loading="loading_decrement" @click="decrement" class="ml-3" >Decrement</btn>
        
        <!-- <btn  @click="test" class="ml-3" >Test</btn -->

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// import { Transaction, PublicKey  } from '@solana/web3.js';
import Btn from '../global/Btn.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { Keypair } from '@solana/web3.js';
import * as CounterProgram from '../../solana/anchor/counter';


let count = ref(0);

let loading_initialize = ref(false);
let loading_increment = ref(false);
let loading_decrement = ref(false);
let counter_keypair = ref({} as Keypair);

const isInitialized = computed(() => {
  if (!counter_keypair.value) {
    return false
  }
  return !!(counter_keypair.value.publicKey)
})

const counterPubKey = computed(() => {
  return counter_keypair.value.publicKey.toBase58()
})

async function initialize() {
  try {
    const newAccount = CounterProgram.generateNewKeypair();

    loading_initialize.value = true
    const result = await CounterProgram.initialize(newAccount)
    readCounterData();

    console.log(result)    
    toast.success(result.txSig);
    counter_keypair.value  = newAccount;
  } catch(error) {
    toast.error(String(error))
  }

  loading_initialize.value = false;
}

async function increment() {
  try {
    loading_increment.value = true
    const result = await CounterProgram.increment(counter_keypair.value as Keypair)
    readCounterData();

    console.log(result)    
    toast.success(result.txSig);
  } catch(error) {
    toast.error(String(error))
    console.error(error)
  }
  loading_increment.value = false
}


async function decrement() {
  try {
    loading_decrement.value = true
    const result = await CounterProgram.decrement(counter_keypair.value as Keypair)
    readCounterData();

    console.log(result)    
    toast.success(result.txSig);
  } catch(error) {
    toast.error(String(error))
  }
  loading_decrement.value = false
}

async function readCounterData() {
  const result = await CounterProgram.getCounter(counter_keypair.value.publicKey);
  count.value = result.count.toNumber();
}

async function test() {
  const r = await CounterProgram.getCounters();
  console.log('getCounters:', r);

  const r2 = await CounterProgram.getCounter(counter_keypair.value.publicKey);
  console.log('getCounter:', r2, r2.count.toNumber(), r2.count.toString());
}
</script>