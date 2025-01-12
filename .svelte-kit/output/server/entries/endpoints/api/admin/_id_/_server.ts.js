import { j as json } from "../../../../../chunks/index.js";
import { d as db, a as admins } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const GET = async ({ params }) => {
  const { id } = params;
  try {
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.userId, id))
      .get();
    if (admin) {
      return json({ authenticated: true, message: "User is an admin." });
    } else {
      return json({ authenticated: false, message: "User is not an admin." });
    }
  } catch (error) {
    console.error("Error checking admin:", error);
    return json(
      {
        authenticated: false,
        message: "Error occurred while checking admin status.",
      },
      { status: 500 },
    );
  }
};
export { GET };
