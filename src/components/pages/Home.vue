<script setup lang="ts">
import { ref } from 'vue'

import { useWallet } from 'solana-wallets-vue';
import { Connection, clusterApiUrl, Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL  } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, MINT_SIZE, getMinimumBalanceForRentExemptMint, createInitializeMint2Instruction } from "@solana/spl-token";
import Btn from '../global/Btn.vue';
import TextInputField from '../global/TextInputField.vue';
import TextAreaField from '../global/TextAreaField.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { SOLANA_NETWORK } from '../../settings';

let address = ref("");
let loading_send_sol = ref(false);

let loading_create_mint = ref(false);

let symbol = ref("");
let isValidSimbol = ref(true);

let description = ref("");
let isValidDescription = ref(true);

let decimals = ref("2");
let isValidDecimals = ref(true);

let mintAddress = ref("");


async function sendSomeSol() {
  try {
    const connection = new Connection(clusterApiUrl(SOLANA_NETWORK))
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

async function createMintAccount() {
  try {
    const connection = new Connection(clusterApiUrl(SOLANA_NETWORK))
    const { publicKey, sendTransaction } = useWallet();
    if (!publicKey.value) throw new Error('No wallet found');

    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const keypair = Keypair.generate();
    const programId = TOKEN_PROGRAM_ID;

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: publicKey.value,
            newAccountPubkey: keypair.publicKey,
            space: MINT_SIZE,
            lamports,
            programId,
        }), 
        createInitializeMint2Instruction(
          keypair.publicKey, 
          Number(decimals.value), 
          new PublicKey(publicKey.value), 
          new PublicKey(publicKey.value), 
          programId
        )
    );

    loading_create_mint.value = true;
    const signature = await sendTransaction(transaction, connection, {signers: [keypair]});
    await connection.confirmTransaction(signature, 'confirmed');
    
    toast.success('Mint account created '+ keypair.publicKey.toBase58());
    mintAddress.value = keypair.publicKey.toBase58();
  } catch(error) {
    console.log(error)
    toast.error(String(error))
  }
  clearMintForm()
  loading_create_mint.value = false;
}

function clearMintForm() {
  symbol.value = "";
  description.value = "";
  decimals.value = 2;
}

</script>


<template>
  <!-- Send some sol-->
  <div class="bg-white shadow sm:rounded-lg my-8">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Send 0.05 sol</h3>
      <div class="mt-2 max-w-xl text-sm text-gray-500">
        <p></p>
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



  <!-- Send some sol-->
  <div class="bg-white shadow sm:rounded-lg my-8">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Create SPL token mint</h3>
      <div class="mt-2 max-w-xl text-sm text-gray-500">
        <p></p>
      </div>
      <form class="mt-5 ">
        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 my-4">
            <TextInputField 
                v-model="symbol" 
                id="symbol"
                name="symbol"
                title="Symbol" 
                width="3"
                :is-valid="isValidSimbol" 
                text-error="Not a valid symbol." 
            />
            <TextInputField 
                v-model="decimals" 
                id="decimals"
                name="decimals"
                title="Decimals" 
                width="3"
                :is-valid="isValidDecimals" 
                text-error="Not a valid decimals." />
         </div>
         <div class="my-4">
         <TextInputField 
            v-model="description" 
            id="description"
            name="description"
            title="Description" 
            :is-valid="isValidDescription" 
            text-error="Not a valid description." 
          />
          </div>
       
          <btn :loading="loading_create_mint" @click="createMintAccount" class="mt-3" >Create Mint Account</btn>

          <div class="w-full mt-4">
            <label for="mintAddress" class="sr-only">Created Mint address</label>
            <input v-model="mintAddress" type="text" name="mintAddress" id="mintAddress" disabled class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Created Mint address" />
          </div>

      </form>
    </div>
  </div>



</template>