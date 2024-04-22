import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import prisma from "@/db/db";
import { customCache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const getPopularProducts = customCache(
  () => {
    return prisma.product.findMany({
      where: {
        isAvailableForPurchase: true,
      },
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
      take: 6,
    });
  },
  ["/", "getPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

const getNewestProducts = customCache(() => {
  return prisma.product.findMany({
    where: {
      isAvailableForPurchase: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });
}, ["/", "getNewestProducts"],);

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        productFetcher={getPopularProducts}
      />
      <ProductGridSection title="Newest" productFetcher={getNewestProducts} />
    </main>
  );
}

type ProductGridSectionProps = {
  productFetcher: () => Promise<Product[]>;
  title: string;
};

function ProductGridSection({
  productFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex  gap-4 ">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href={"/products"} className="space-x-2">
            <span> View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense fallback={<ProductCardSkeleton />}>
          <ProductSuspense productFetcher={productFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

export async function ProductSuspense({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  return (await productFetcher()).map((product) => (
    <ProductCard
      description={product.description}
      price={product.price}
      name={product.name}
      id={product.id}
      imagePath={product.imagePath}
      key={product.id}
    />
  ));
}
