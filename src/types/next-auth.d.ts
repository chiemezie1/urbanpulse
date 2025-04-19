import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
      username?: string
      locationId?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name: string
    email: string
    image?: string
    role?: string
    username?: string
    locationId?: string
    location?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
    username?: string
    locationId?: string
  }
}
