import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Gallery is a luxury art space, with an international collective of artists, curators, and cultural strategists, sharing one strong creative signature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/poppl-laudatio-regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
