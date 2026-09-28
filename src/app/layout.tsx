import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prajha Groups | Executive Admin Panel",
  description: "Enterprise management dashboard for Prajha Groups Business Development, Construction, and Facility Management divisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-[#f37924] selection:text-white">
        <ToastContainer position="top-right" autoClose={3000} />
        {children}
      </body>
    </html>
  );
}
