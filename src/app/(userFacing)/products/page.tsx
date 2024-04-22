import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";
import prisma from "@/db/db";
import { customCache } from "@/lib/cache";

export default async function Products() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense fallback={<ProductCardSkeleton />}>
        <ProductSuspense />
      </Suspense>
    </div>
  );
}

const getProducts = customCache(() => {
  return prisma.product.findMany({
    where: {
      isAvailableForPurchase: true,
    },
  });
}, ["/product", "getProducts"]);

async function ProductSuspense() {
  const products = await getProducts();

  return products.map((product) => {
    return (
      <ProductCard
        description={product.description}
        price={product.price}
        name={product.name}
        id={product.id}
        imagePath={product.imagePath}
        key={product.id}
      />
    );
  });
}
