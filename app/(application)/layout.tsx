import type { Metadata } from "next";
import ClerkProviders from "./providers/ClerkProviders";

export const metadata: Metadata = {
  title: "AI Mock Interview Platform",
  description: "AI Mock Interview Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClerkProviders>{children}</ClerkProviders>;
}
