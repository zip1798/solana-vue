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

import idl from "../../idl/anchor_counter.json";
import { useWallet, useAnchorWallet } from 'solana-wallets-vue';
import { 
    Connection, 
    clusterApiUrl,
    PublicKey, 
    Transaction
} from '@solana/web3.js';
import { SOLANA_NETWORK } from '../../settings';
import { initConnection, sendAndConfirmTransaction } from '../../solana/utils';


import {
    Program,
    Idl,
    AnchorProvider,
    setProvider,
    web3,
} from "@coral-xyz/anchor"


let loading_initialize = ref(false);


async function initialize() {
  try {
    const connection = new Connection(clusterApiUrl(SOLANA_NETWORK))
    const anchorWallet = useAnchorWallet();

    //@ts-ignore
    const provider = new AnchorProvider(connection, anchorWallet.value, {});
    setProvider(provider)

    // const programId = new PublicKey(import.meta.env.VITE_COUNTER_ID);

    const program = new Program(idl as Idl);

    const newAccount = web3.Keypair.generate();

    //@ts-ignore
    console.log('anchorWallet', anchorWallet.value.publicKey.toBase58())

    loading_initialize.value = true
    const sig = await program.methods
        .initialize()
        .accounts({
            counter: newAccount.publicKey,
        })
        .signers([newAccount])
        .rpc()
    console.log(sig)    
    toast.success(sig);
    
  } catch(error) {
    toast.error(String(error))
  }

  loading_initialize.value = false;
}

</script>