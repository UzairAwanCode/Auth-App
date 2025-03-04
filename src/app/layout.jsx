import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import SessionProvider from "@/utils/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession()
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <div className="mx-auto max-w-5xl text-2xl gap-2">
            <Navbar />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
