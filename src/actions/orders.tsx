"use server";

import prisma from "@/db/db";
import OrderHistoryEmail from "@/email/OrderHistory";
import { z } from "Zod";
import { Resend } from "resend";

const emailSchema = z.string().email();

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function emailOrderHistory(
  prevstate: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"));

  if (result.success === false) {
    return { error: "Invalid email address" };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: result.data,
    },
    select: {
      email: true,

      orders: {
        select: {
          price: true,
          id: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (user === null) {
    return {
      message:
        "Check your email to view your order history and dowanload your products.",
    };
  }

  const orders = user?.orders.map((order) => {
    return {
      ...order,
      downloadVerificationId: prisma.downloadVerification.create({
        data: {
          expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
          productId: order.product.id,
        },
      }),
    };
  });

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",

    react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
  });

  if (data.error) {
    return { error: "There was error sending your email, Please try again." };
  }

  return {
    message:
      "Check your email to view your order history and dowanload your products.",
  };
}
