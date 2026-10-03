import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CostaViva",
  description:
    "Monitoramento participativo da erosão costeira no litoral de Sergipe: mapa de zonas críticas e relatos geolocalizados.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="app-header">
          <h1>CostaViva</h1>
          <p>Erosão costeira no litoral de Sergipe</p>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
