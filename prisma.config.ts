import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:password@localhost:5432/roomie_grocery',
    // directUrl is used for Neon Postgres direct connection (for migrations)
    // In Prisma v7, connection URLs live here rather than in schema.prisma
  },
})
