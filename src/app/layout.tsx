import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://marciobarrios-pixels.vercel.app"),
  title: "Marcio Barrios ⋅ Design Engineer",
  description:
    "I move pixels. Design Engineer in Barcelona, currently building the filmmaking canvas at MITO AI. Selected work, side projects, and small details.",
  openGraph: {
    title: "Marcio Barrios ⋅ I move pixels.",
    description: "Design Engineer in Barcelona. Currently building at MITO AI.",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", creator: "@marciobarrios" },
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#191c19" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('mb-theme');document.documentElement.classList.toggle('dark',t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))}catch(e){document.documentElement.classList.toggle('dark',matchMedia('(prefers-color-scheme: dark)').matches)}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistMono.variable} scroll-smooth scroll-pt-8 motion-reduce:scroll-auto`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="m-0 bg-background font-sans text-[13px] text-foreground antialiased selection:bg-accent selection:text-accent-foreground before:pointer-events-none before:fixed before:inset-0 before:z-40 before:bg-(image:--noise) before:opacity-[0.08] before:content-[''] dark:before:opacity-[0.035]">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
