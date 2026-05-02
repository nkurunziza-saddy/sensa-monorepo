import type { Metadata } from "next";
import "@/index.css";
import { Provider } from "@/components/ui/provider";

export const metadata: Metadata = {
  title: "Sensa Bridge | High-Fidelity Communication",
  description: "A refined multimodal communication bridge built for clarity and accessibility.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Provider>
          <main className="min-h-screen bg-canvas">
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
