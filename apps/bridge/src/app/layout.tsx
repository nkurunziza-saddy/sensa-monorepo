import type { Metadata } from "next";
import "@/index.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "Sensa Bridge | High-Fidelity Communication",
  description: "A refined multimodal communication bridge built for clarity and accessibility.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <main className="min-h-screen bg-canvas">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
