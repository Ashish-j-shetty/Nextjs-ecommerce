import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Hr,
} from "@react-email/components";
import { OrderInformation } from "./_components/OrderInformation";
import React from "react";

type OrderInfromationProps = {
  id: string;
  createdAt: Date;
  price: number;
};
type OrderHistoryEmailProps = {
  orders: {
    id: string;
    price: number;
    createdAt: Date;
    downloadVerificationId: string;
    product: { name: string; imagePath: string; description: string };
  }[];
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      price: 100,
      createdAt: new Date(),
      product: {
        name: "Product name",
        imagePath: "/products/2f1b4d5c-243c-448d-abcc-d9e7b1a995ddimage.png",
        description: "some description",
      },
      downloadVerificationId: crypto.randomUUID(),
    },
    {
      id: crypto.randomUUID(),
      price: 110,
      createdAt: new Date(),
      product: {
        name: "Product name 2",
        imagePath: "/products/2f1b4d5c-243c-448d-abcc-d9e7b1a995ddimage.png",
        description: "some other  description",
      },
      downloadVerificationId: crypto.randomUUID(),
    },
  ],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head></Head>
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>
              <h1>Order History </h1>
            </Heading>
            {orders.map((order, index) => {
              return (
                <React.Fragment key={order.id}>
                  <OrderInformation
                    order={order}
                    product={order.product}
                    downloadVerificationId={order.downloadVerificationId}
                  />
                  {index < orders.length - 1 && <Hr />}
                </React.Fragment>
              );
            })}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
