import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./_components/OrderInformation";

type OrderInfromationProps = {
  id: string;
  createdAt: Date;
  price: number;
};
type PurchaseReceiptEmailProps = {
  product: { name: string; imagePath: string; description: string };
  order: OrderInfromationProps;
  downloadVerificationId: string;
};

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Product name",
    imagePath: "/products/2f1b4d5c-243c-448d-abcc-d9e7b1a995ddimage.png",
    description: "some description",
  },
  order: { id: crypto.randomUUID(), createdAt: new Date(), price: 100 },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view reciept</Preview>
      <Tailwind>
        <Head></Head>
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
