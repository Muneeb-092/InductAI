const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

// 1. Create the native Postgres connection pool
const pool = new Pool({ connectionString });

// 2. Wrap it in the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter into the Prisma Client
const prisma = new PrismaClient({ adapter });

module.exports = prisma;