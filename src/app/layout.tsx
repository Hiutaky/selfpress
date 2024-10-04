import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "~/components/sections/Header";
import { TRPCReactProvider } from "~/trpc/react";
import { cookies } from "next/headers";
import "./material.css";
import { TooltipProvider } from "~/components/ui/tooltip";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SelfPress",
  description: "Effortlessly manage WordPress installations in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} text-white text-opacity-60 text-xs bg-black antialiased`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <div className="flex flex-col justify-center items-center">
            <Header />
            <div className="container p-6 rounded shadow-sm">
              <TooltipProvider>{children}</TooltipProvider>
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
