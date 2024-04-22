"use server";

import prisma from "@/db/db";

export async function userOrderExists({
  productId,
  email,
}: {
  productId: string;
  email: string;
}) {
  return (
    (await prisma.order.findFirst({
      where: {
        user: { email: email },
        productId: productId,
      },
      select: { id: true },
    })) !== null
  );
}
