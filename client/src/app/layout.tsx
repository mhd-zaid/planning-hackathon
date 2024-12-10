import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planning",
  description: "Planning Hackathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-white">{children}</body>
    </html>
  );
}
