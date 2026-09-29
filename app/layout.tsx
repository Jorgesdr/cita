import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "¿Quieres una cita conmigo? 💕",
  description: "Una pregunta muy importante...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}