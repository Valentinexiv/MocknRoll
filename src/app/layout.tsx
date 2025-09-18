import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mock’n’Roll",
    template: "%s – Mock’n’Roll",
  },
  description: "Create and publish Madden 26 mock drafts with commentary.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mockn-roll.vercel.app"),
  openGraph: {
    title: "Mock’n’Roll",
    description: "Create and publish Madden 26 mock drafts with commentary.",
    siteName: "Mock’n’Roll",
    images: [
      {
        url: "/mnr_logo.png",
        width: 800,
        height: 800,
        alt: "Mock’n’Roll",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mock’n’Roll",
    description: "Create and publish Madden 26 mock drafts with commentary.",
    images: ["/mnr_logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
