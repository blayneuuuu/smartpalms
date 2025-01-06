import prisma from "@/prisma";

export const connectToDatabase = async () => {
  try {
    await prisma.$connect;
  } catch (error) {
    console.log(error);
    throw new Error("unable to connect");
  }
};

export const handleHeaders = (
  isPrivate: boolean | undefined,
  isFile = false
) => {
  let headerOptions: HeadersInit = {
    "Content-Type": isFile ? "multipart/form-data" : "application/json",
  };

  if (isPrivate) {
    headerOptions = {...headerOptions, token: ""};
  }
  return headerOptions;
};
