
export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("User layout loaded");

  return <div>{children}</div>;
}
