"use client";

import { emailOrderHistory } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";

export default function MyOrdersPage() {
  const [data, action] = useFormState(emailOrderHistory, {});

  return (
    <form className="max-2-xl mx-auto" action={action}>
      <Card>
        <CardHeader>
          <CardTitle>My orders</CardTitle>
          <CardDescription>
            Enter your email and we will email you your order and download links
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" required />
            {data.error && <div className="text-destructive">{data.error}</div>}
          </div>
        </CardContent>
        <CardFooter>
          {data.message ? <div>{data.message}</div> : <Submitbutton />}
        </CardFooter>
      </Card>
    </form>
  );
}

function Submitbutton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" size={"lg"} type="submit">
      {pending ? "Sending..." : "Send"}
    </Button>
  );
}
