import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasource: {
    // DATABASE_URL = pooled connection (Neon serverless proxy) — for runtime queries
    // DATABASE_URL_UNPOOLED = direct connection — required for Prisma migrations
    url: process.env.DATABASE_URL,
    directUrl: process.env.DATABASE_URL_UNPOOLED,
  },
})
