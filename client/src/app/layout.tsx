import "./globals.css";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Simple PWA",
  description: "A simple PWA with installation and notifications",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#4285f4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
