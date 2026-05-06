import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL || "";
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Check your .env file.");
}

const adapterUrl = databaseUrl.startsWith("mysql://")
	? databaseUrl.replace("mysql://", "mariadb://")
	: databaseUrl;

const adapter = new PrismaMariaDb(adapterUrl);

export const prisma = new PrismaClient({ adapter });
