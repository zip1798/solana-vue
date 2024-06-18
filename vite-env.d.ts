/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PINATA_JWT: string
  readonly VITE_PINATA_GATEWAY: string
  readonly VITE_PINATA_API_KEY: string
  readonly VITE_PINATA_API_SECRET: string
  // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }