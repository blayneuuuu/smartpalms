import { j as json } from "../../../../../chunks/index.js";
import { d as db, l as lockers, u as users } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
const VALID_SIZES = ["small", "medium", "large"];
const GET = async ({ locals }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 }
      );
    }
    const allLockers = await db.select({
      id: lockers.id,
      number: lockers.number,
      size: lockers.size,
      userId: lockers.userId,
      userName: users.name,
      userEmail: users.email
    }).from(lockers).leftJoin(users, eq(lockers.userId, users.id)).orderBy(lockers.size, lockers.number);
    return json({ lockers: allLockers });
  } catch (error) {
    console.error("Error fetching lockers:", error);
    return json({ message: "Failed to fetch lockers" }, { status: 500 });
  }
};
const POST = async ({ locals, request }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 }
      );
    }
    const body = await request.json();
    const { number, size } = body;
    if (!number || typeof number !== "string") {
      return json({ message: "Invalid locker number" }, { status: 400 });
    }
    if (!size || !VALID_SIZES.includes(size)) {
      return json({ message: "Invalid locker size" }, { status: 400 });
    }
    const [existingLocker] = await db.select().from(lockers).where(eq(lockers.number, number));
    if (existingLocker) {
      return json(
        { message: "Locker with this number already exists" },
        { status: 400 }
      );
    }
    await db.insert(lockers).values({
      id: randomUUID(),
      number,
      size,
      isOccupied: false
    });
    return json({ success: true });
  } catch (error) {
    console.error("Error creating locker:", error);
    if (error instanceof Error) {
      return json({ message: error.message }, { status: 500 });
    }
    return json({ message: "Failed to create locker" }, { status: 500 });
  }
};
export {
  GET,
  POST
};
