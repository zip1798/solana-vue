<script setup lang="ts">
import { ref } from 'vue'

import { useWallet } from 'solana-wallets-vue';
import { Connection, clusterApiUrl, Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL  } from '@solana/web3.js';
import Btn from '../global/Btn.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

let address = ref("");
let loading_send_sol = ref(false);

const count = ref(0)

async function sendSomeSol() {
  try {
    const connection = new Connection(clusterApiUrl('devnet'))
    const { publicKey, sendTransaction } = useWallet();
    if (!publicKey.value) throw new Error('No wallet found');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey.value,
        toPubkey: new PublicKey(address.value), // "B5EucqcybsSdvP2CYQzJwmKDmTLgPMWnY2Gswjv4LwNb"
        lamports: 0.05 * LAMPORTS_PER_SOL,
      })
    );

    loading_send_sol.value = true;
    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'processed');
    toast.success('0.05 SOL sent');
  } catch(error) {
    toast.error(String(error))
  }
  address.value = "";
  loading_send_sol.value = false;
}

</script>


<template>
  <!-- Send some sol-->
  <div class="bg-white shadow sm:rounded-lg my-8">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Send 0.05 sol</h3>
      <div class="mt-2 max-w-xl text-sm text-gray-500">
        <p>Change the email address you want associated with your account.</p>
      </div>
      <form class="mt-5 sm:flex sm:items-center">
        <div class="w-full sm:max-w-xs">
          <label for="address" class="sr-only">Solana address</label>
          <input v-model="address" type="text" name="address" id="address" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="solana address" />
        </div>
        <btn :loading="loading_send_sol" @click="sendSomeSol" class="ml-3" >Send 0.05 sol</btn>
      </form>
    </div>
  </div>



</template>