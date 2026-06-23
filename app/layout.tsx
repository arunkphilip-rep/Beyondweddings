import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "../src/components/SiteShell";

export const metadata: Metadata = {
  title: "BEYOND WEDDINGS | Fine Art & Editorial Wedding Photography",
  description: "Beyond Weddings offers fine art, contemporary, and editorial wedding photography worldwide. Experience storytelling frame by frame.",
  openGraph: {
    title: "BEYOND WEDDINGS | Fine Art Wedding Photography",
    description: "Capture timeless memories with BEYOND WEDDINGS. Refined and artful storytelling.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans">
        <SiteShell>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
