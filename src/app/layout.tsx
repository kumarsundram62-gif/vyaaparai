import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "VyaparAI | Smarter Business. Stronger Connections.",
  description:
    "VyaparAI is an AI-powered wholesale and retail management platform connecting wholesalers and shopkeepers through intelligent ordering, inventory management, transparent financial records, and AI-powered business assistance.",
  keywords: [
    "B2B SaaS",
    "wholesale management",
    "retail kirana",
    "inventory management",
    "digital udhaar ledger",
    "VyaparAI",
    "Shivam Mishra",
  ],
  authors: [{ name: "Shivam Mishra", url: "https://www.linkedin.com/in/shivam-mishra-822406445" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('vyaparai-theme');
                  var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && supportDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased selection:bg-teal-500 selection:text-white">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
