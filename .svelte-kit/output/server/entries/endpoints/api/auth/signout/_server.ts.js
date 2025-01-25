import { j as json } from "../../../../../chunks/index.js";
const POST = async ({ cookies }) => {
  cookies.delete("session", { path: "/" });
  return json({ success: true });
};
export {
  POST
};
