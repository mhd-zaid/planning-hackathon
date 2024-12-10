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
      <body>{children}</body>
    </html>
  );
}
