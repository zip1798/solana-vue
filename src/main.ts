import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Vue3Toastify, {type ToastContainerOptions} from 'vue3-toastify'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import routes from './routes'

import SolanaWallets from "solana-wallets-vue";

// You can either import the default styles or create your own.
import "solana-wallets-vue/styles.css";
//@ts-ignore
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
  ],
  autoConnect: true,
};

// Routing
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(router)
  .use(Vue3Toastify, {
    // autoClose: 3000,
    closeOnClick: false,
  } as ToastContainerOptions)
  .use(SolanaWallets, walletOptions)
  .mount("#app");

  // https://github.com/lorisleiva/solana-wallets-vue

// https://github.com/anza-xyz/wallet-adapter/pull/949

// remove node_modules
// remove any lock file
// add the following in package.json
//   "overrides": { "@ledgerhq/errors": "6.16.3" }
// run npm i --force

// https://github.com/anza-xyz/wallet-adapter/issues/950