import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { price: true },
    _count: true,
  });

  return { amount: data._sum.price || 0, totalSales: data._count };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { price: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData._sum.price || 0) / userCount,
  };
}

async function getProducts() {
  const [activeProducts, inactiveProducts] = await Promise.all([
    prisma.product.count({
      where: {
        isAvailableForPurchase: true,
      },
    }),
    prisma.product.count({
      where: {
        isAvailableForPurchase: false,
      },
    }),
  ]);

  return { activeProducts, inactiveProducts };
}

export default async function AdminDashboard() {
  const [userData, salesData, productData] = await Promise.all([
    getUserData(),
    getSalesData(),
    getProducts(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subTitle={`${formatNumber(salesData.totalSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subTitle={`${formatCurrency(
          userData.averageValuePerUser
        )} Average Value`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        subTitle={`${formatNumber(productData.inactiveProducts)} Inactive `}
        body={formatNumber(productData.activeProducts)}
      />
    </div>
  );
}

function DashboardCard({
  title,
  subTitle,
  body,
}: {
  title: string;
  subTitle: string;
  body: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
