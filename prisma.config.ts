import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasource: {
    // DATABASE_URL = pooled connection (Neon serverless proxy) — for runtime queries and schema pushes
    url: process.env.DATABASE_URL,
  },
})
