import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create coordinates
    const coordinatesId = uuidv4()
    await prisma.coordinates.create({
      data: {
        id: coordinatesId,
        latitude: 0,
        longitude: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Create location
    const locationId = uuidv4()
    await prisma.location.create({
      data: {
        id: locationId,
        city: "Default City",
        state: "Default State",
        country: "Default Country",
        coordinatesId: coordinatesId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Generate a username from email
    const username = email.split('@')[0] + Math.floor(Math.random() * 1000)

    // Create user with the location
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        username,
        name: name,
        email,
        password: hashedPassword,
        image: `/placeholder.svg?height=40&width=40&text=${name.charAt(0)}`,
        locationId: locationId,
        role: "RESIDENT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ message: "Failed to register user", error: String(error) }, { status: 500 })
  }
}
