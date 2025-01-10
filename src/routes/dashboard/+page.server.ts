export const load = async ({locals}) => {
  console.log("Server-side user data:", locals.session);

  return {
    user: locals.session,
  };
};
