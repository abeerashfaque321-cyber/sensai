import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// .env file se variables load karne ke liye
dotenv.config();

export default defineConfig({
  datasource: {
    // Check karein ki DATABASE_URL load ho rahi hai
    url: process.env.DATABASE_URL,
  },
});