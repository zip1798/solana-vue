import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://github.com/ardriveapp/turbo-sdk/issues/51
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills()],
  define: {
    global: {},
    'process.env': {}
  }
})
