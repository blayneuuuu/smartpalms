import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcryptjs";
import {z} from "zod";
import {nanoid} from "nanoid";

// Input validation schema
// const registerSchema = z.object({
//   email: z.string().email("Invalid email format"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   fullname: z.string().optional(),
//   address: z.string().optional(),
//   type: z.enum(["user", "admin"]).default("user"),
// });

export const POST: RequestHandler = async ({request}) => {
  try {
    const body = await request.json();

    // Validate input
    // const validatedData = registerSchema.parse(body);
    const validatedData = body;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .get();

    if (existingUser) {
      return json(
        {
          success: false,
          message: "User already exists with this email",
        },
        {status: 400}
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        id: nanoid(),
        email: validatedData.email,
        password: hashedPassword,
        fullname: validatedData.fullname || null,
        address: validatedData.address || null,
        type: validatedData.type,
      })
      .returning()
      .get();

    // Remove password from response
    const {password: _, ...userWithoutPassword} = newUser;

    return json(
      {
        success: true,
        message: "User registered successfully",
        user: userWithoutPassword,
      },
      {status: 201}
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        {status: 400}
      );
    }

    return json(
      {
        success: false,
        message: "Internal server error",
      },
      {status: 500}
    );
  }
};
