import {requireUser} from "$lib/server/auth";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async ({locals}) => {
  const user = await requireUser(locals);
  return {user};
};
