import { r as redirect } from "../../../chunks/index.js";
const GET = async ({ cookies }) => {
  cookies.delete("session", { path: "/" });
  throw redirect(302, "/");
};
export {
  GET
};
