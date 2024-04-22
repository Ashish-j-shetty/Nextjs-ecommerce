"use client";

import { userOrderExists } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Product } from "@prisma/client";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
  product: Product;
  clientSecret: string;
};

// const stripePromise = loadStripe(process.env.NEXT_STRIPE_PUBLIC_KEY as string);

const stripePromise = loadStripe(process.env.NEXT_STRIPE_PUBLIC_KEY as string);

export default function CheckoutForm({
  product,
  clientSecret,
}: CheckoutFormProps) {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8 ">
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg">{formatCurrency(product.price)}</div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form price={product.price} productId={product.id} />
      </Elements>
    </div>
  );
}

function Form({ price, productId }: { price: number; productId: string }) {
  const stripe = useStripe();
  const element = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const [email, setEmail] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || element == null || email == null) {
      return;
    }
    setIsLoading(true);

    // check for existing order

    const orderExists = await userOrderExists({ email, productId });

    console.log(orderExists);

    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product , try downloading it from my orderes"
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements: element,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        console.log(error);
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unkonwn error occured");
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(evt) => setEmail(evt.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size={"lg"}
            disabled={stripe == null || element == null || isLoading}
          >
            {isLoading ? "Purchasing..." : `Purchase ${formatCurrency(price)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
