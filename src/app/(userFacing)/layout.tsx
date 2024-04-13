import Nav, { NavLink } from "@/components/Nav";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href={"/"}>Home</NavLink>
        <NavLink href={"/products"}>Product</NavLink>
        <NavLink href={"/orders"}>My Orders</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
