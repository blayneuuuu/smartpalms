import prisma from "@/prisma";
import {NextResponse} from "next/server";

export const POST = async (req: Request) => {
  try {
    await prisma.$connect();
    const body = await req.json();

    const newUser = await prisma.user.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json({"User Created": {...newUser}}, {status: 201});
  } catch (error) {
    console.log(error);
    return NextResponse.json({error: "error"}, {status: 500});
  } finally {
    prisma.$disconnect();
  }
};
