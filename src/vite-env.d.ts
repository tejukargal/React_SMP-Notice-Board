/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NILE_DATABASE_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
