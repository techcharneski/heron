import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Heron Charneski — Direito Tributário e Contabilidade",
    template: "%s | Heron Charneski"
  },
  description: "Site acadêmico e profissional de Heron Charneski, parecerista e consultor especializado em Direito Tributário com interface contábil, IRPJ, CSLL e Preços de Transferência.",
  keywords: ["parecerista tributário", "contabilidade e direito tributário", "tributação e normas contábeis", "IRPJ e CSLL", "preços de transferência pareceres", "reforma tributária IBS CBS"],
  authors: [{ name: "Heron Charneski" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${lora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-text font-sans selection:bg-brand-navy selection:text-white">
        {children}
      </body>
    </html>
  );
}
