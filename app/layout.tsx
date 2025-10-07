import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { NavigationProvider } from "@/lib/navigation-provider";
import { NavigationEvents } from "@/components/NavigationEvents";

export const metadata: Metadata = {
  title: "SIMASDATA",
  description: "SIMASDATA is a luxury art space, with an international collective of artists, curators, and cultural strategists, sharing one strong creative signature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="preload"
          href="/fonts/poppl-laudatio-regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // AGGRESSIVE LIGHT MODE ENFORCEMENT
                const enforceLight = () => {
                  document.documentElement.classList.remove('dark');
                  document.body.classList.remove('dark');
                  document.documentElement.className = document.documentElement.className.replace(/\\bdark\\b/g, '');
                };

                // Run immediately
                enforceLight();

                // Watch for any attempts to add dark class
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                      if (document.documentElement.classList.contains('dark')) {
                        enforceLight();
                      }
                    }
                  });
                });

                // Start observing
                observer.observe(document.documentElement, {
                  attributes: true,
                  attributeFilter: ['class']
                });

                // Also run on various events
                document.addEventListener('DOMContentLoaded', enforceLight);
                window.addEventListener('load', enforceLight);

                // Cleanup function for when we actually want to allow dark mode
                window.__enforceLightMode = { observer, enforceLight };

              } catch (e) {
                console.log('Light mode enforcement error:', e);
              }
            `,
          }}
        />
      </head>
      <body className="antialiased bg-surface text-text-primary transition-theme">
        <ThemeProvider>
          <NavigationProvider>
            <NavigationEvents />
            {children}
          </NavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
