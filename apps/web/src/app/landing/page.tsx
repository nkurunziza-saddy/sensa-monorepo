import type { Metadata } from "next";

import LandingClientPage from "./page.client";

export const metadata: Metadata = {
  title: "Landing | Sensa",
  description: "A calm, adaptive communication bridge for people with different access needs.",
};

export default function LandingPage() {
  return <LandingClientPage />;
}
