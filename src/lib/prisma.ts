import { PrismaClient } from "@prisma/client"

// PrismaClient is attached to the `globalThis` object in development to prevent
// exhausting your database connection limit.

let prisma: PrismaClient

if (typeof globalThis !== "undefined") {
  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
  }
  prisma = (globalThis as any).prisma
} else {
  // In production, it's safe to create a new instance
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export { prisma }
