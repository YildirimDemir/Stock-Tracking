import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSession } from "next-auth/react"; 
import NextSessionProvider from "@/provider/NextSessionProvider";
import QueryProvider from "@/provider/QueryProvider";
import Footer from "@/components/ui/Footer/Footer";
import Navbar from "@/components/ui/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Tracking",
  description: "List and track your stocks",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession(); 

  return (
    <NextSessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
         <QueryProvider>
          <Navbar />
          {children}
          <Footer />
         </QueryProvider>
          </body>
      </html>
    </NextSessionProvider>
  );
}
