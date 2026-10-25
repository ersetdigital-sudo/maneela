import type { Metadata } from "next";
import { Instrument_Sans, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const display = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-schibsted",
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3009"),
  title: {
    default: "Maneela · Semua kebutuhan digital, beres sekejap",
    template: "%s · Maneela",
  },
  description:
    "Top up pulsa, paket data, e-wallet, token PLN, voucher game, dan bayar tagihan 24 jam lewat QRIS.",
  openGraph: {
    title: "Maneela · Semua kebutuhan digital, beres sekejap",
    description:
      "Top up pulsa, paket data, e-wallet, token PLN, voucher game, dan bayar tagihan 24 jam lewat QRIS.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
