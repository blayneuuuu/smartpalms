import { j as json } from "../../../../../chunks/index.js";
import { d as db, u as users } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const GET = async ({ params }) => {
  const { id } = params;
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).get();
    if (user && user.type === "admin") {
      return json({ authenticated: true, message: "User is an admin." });
    } else {
      return json({ authenticated: false, message: "User is not an admin." });
    }
  } catch (error) {
    console.error("Error checking admin:", error);
    return json(
      {
        authenticated: false,
        message: "Error occurred while checking admin status."
      },
      { status: 500 }
    );
  }
};
export {
  GET
};
