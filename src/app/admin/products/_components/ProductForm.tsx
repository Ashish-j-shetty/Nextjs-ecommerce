"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { addProduct, updateProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );

  const [price, setPrice] = useState<number | undefined>(product?.price);

  return (
    <form className="space-y-8" action={action}>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          defaultValue={product?.name || ""}
          className={`${error.name ? "border-red-500 " : ""}`}
        />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          type="number"
          id="price"
          name="price"
          required
          value={price}
          defaultValue={product?.price || ""}
          onChange={(e) => setPrice(Number(e.target.value) || undefined)}
        />
        {error.price && <div className="text-destructive">{error.price}</div>}
      </div>

      <div className="text-muted-foreground">{formatCurrency(price || 0)}</div>

      <div className="space-y-2">
        <Label htmlFor="description">Desription</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && (
          <div className="text-muted-foreground">{product?.filePath}</div>
        )}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && (
          <Image
            src={product?.imagePath}
            alt="uploaded image"
            height={400}
            width={400}
          />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
