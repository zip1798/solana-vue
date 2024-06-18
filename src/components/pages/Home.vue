<script setup lang="ts">
import { ref } from 'vue'

// import { useWallet } from 'solana-wallets-vue';
import { Connection, clusterApiUrl, Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL  } from '@solana/web3.js';
// import { TOKEN_PROGRAM_ID,  MINT_SIZE, getMinimumBalanceForRentExemptMint, createInitializeMint2Instruction } from "@solana/spl-token";
import Btn from '../global/Btn.vue';
import TextInputField from '../global/TextInputField.vue';
// import TextAreaField from '../global/TextAreaField.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
// import { SOLANA_NETWORK } from '../../settings';
import PinataSDK from '@pinata/sdk';

import { splCreateMintAccount } from '../../solana/spl/create_mint_account';
import { createTransfer } from '../../solana/system/create_transfer';
import { initConnection, sendAndConfirmTransaction } from '../../solana/utils';

import axios from 'axios';

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
let uploadedFile = ref("");

const fileInput = ref<HTMLInputElement | null>(null)
const files = ref()

function handleFileChange() {
    files.value = fileInput.value?.files
    console.log(files.value)
    console.log(import.meta.env.VITE_PINATA_API_KEY) 
    console.log(import.meta.env.VITE_PINATA_API_SECRET) 
}
async function sendSomeSol() {
  try {
    const { connection, publicKey } = initConnection();

    const transaction = new Transaction();
    createTransfer(transaction, publicKey, new PublicKey(address.value), 0.05);
    // "B5EucqcybsSdvP2CYQzJwmKDmTLgPMWnY2Gswjv4LwNb"

    loading_send_sol.value = true;
    await sendAndConfirmTransaction(connection, transaction);

    toast.success('0.05 SOL sent');
  } catch(error) {
    toast.error(String(error))
  }
  address.value = "";
  loading_send_sol.value = false;
}

async function createMintAccount() {
  try {
    const { connection, publicKey } = initConnection();

    const transaction = new Transaction();
    const { keypair } = await splCreateMintAccount(connection, transaction, publicKey, Number(decimals.value));

    loading_create_mint.value = true;
    await sendAndConfirmTransaction(connection, transaction, {signers: [keypair]});
    
    toast.success('Mint account created '+ keypair.publicKey.toBase58());
    mintAddress.value = keypair.publicKey.toBase58();
  } catch(error) {
    toast.error(String(error))
  }
  clearMintForm()
  loading_create_mint.value = false;
}

function clearMintForm() {
  symbol.value = "";
  description.value = "";
  decimals.value = "2";
}

async function uploadFile() {
  // const pinata = new PinataSDK({ pinataApiKey: import.meta.env.VITE_PINATA_API_KEY, pinataSecretApiKey: import.meta.env.VITE_PINATA_API_SECRET });
  // const res = await pinata.testAuthentication()
  // console.log(res)
 

    const file = files.value[0]
    console.log(file)
    let formData = new FormData();
    formData.append('file', file);
    
    const pinataMetadata = JSON.stringify({
      name: file.name,
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
      }
    );

    console.log(res.data);    

    uploadedFile.value = import.meta.env.VITE_PINATA_GATEWAY + res.data.IpfsHash;

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

  
<!-- Upload file to pinata -->
<div class="bg-white shadow sm:rounded-lg my-8">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Upload file to pinata</h3>
      <div class="mt-2 max-w-xl text-sm text-gray-500">
        <p></p>
      </div>
      <form class="mt-5 ">
        <div class="w-full ">
          <label class="block mb-2 text-sm font-medium text-gray-900 " for="file_input">Upload file</label>
          <input ref="fileInput"  @change="handleFileChange"  
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none " aria-describedby="file_input_help" id="file_input" type="file">
          <p class="mt-1 text-sm text-gray-500" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
        </div>
        <btn @click="uploadFile" >Upload file</btn>

        <div class="w-full mt-4">
          <label for="uploadedFile" class="sr-only">Uploaded File</label>
          <input v-model="uploadedFile" type="text" name="uploadedFile" id="uploadedFile" disabled class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Uploaded File" />
        </div>

      </form>
    </div>
  </div>


</template>