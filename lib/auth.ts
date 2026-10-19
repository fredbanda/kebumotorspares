import { betterAuth } from "better-auth";
import { Pool } from "pg";

const database = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
  database: database,
  baseURL: baseURL,
  trustedOrigins: [
    baseURL,
    "https://www.kebumotorspares.co.za",
    "https://kebumotorspares.co.za",
    "http://localhost:3000",
  ],
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'customer',
        input: false,
      },
    },
  },
});
