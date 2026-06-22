import type { Metadata } from "next";
import "./globals.css";
import Preloader from "../src/components/Preloader";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import SmoothScroll from "../src/components/SmoothScroll";
import ScrollToTop from "../src/components/ScrollToTop";

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
        <Preloader />
        <Navbar />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}

