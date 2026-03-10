import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lane Campos Group",
  description:
    "Lane Campos Group installs HIPAA-aware digital intake infrastructure for private practices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}