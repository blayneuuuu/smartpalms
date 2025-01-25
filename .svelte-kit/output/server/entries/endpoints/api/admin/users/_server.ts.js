import { j as json } from "../../../../../chunks/index.js";
import { d as db, u as users } from "../../../../../chunks/index2.js";
const GET = async ({ locals }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 }
      );
    }
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      type: users.type,
      createdAt: users.createdAt
    }).from(users).orderBy(users.createdAt);
    return json({ users: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return json({ message: "Failed to fetch users" }, { status: 500 });
  }
};
export {
  GET
};
