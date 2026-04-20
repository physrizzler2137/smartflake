import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { FontProvider } from '@/context/FontProvider';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'SMaRT-Lab',
  description: 'Smart Materials and Soft Robotics Laboratory',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&family=Merriweather&family=Lora&family=Playfair+Display&family=EB+Garamond&family=Cormorant+Garamond&family=Libre+Baskerville&family=Arvo&family=PT+Serif&family=Cardo&family=Old+Standard+TT&family=Raleway&family=Lato&family=Noto+Serif&family=Source+Serif+Pro&family=Roboto+Slab:wght@400;700&family=Orbitron&family=Electrolize&family=Audiowide&family=Chakra+Petch&family=Share+Tech+Mono&family=Roboto+Mono:wght@400;700&family=Nova+Square&family=Bungee&family=Cutive+Mono&family=Fira+Mono&family=Gruppo&family=Syncopate&family=VT323&family=Tomorrow&family=Russo+One&family=Roboto:wght@400;700&family=Roboto+Condensed:wght@400;700&family=Roboto+Serif:wght@400;700&family=Zilla+Slab&family=Rokkitt&family=Josefin+Slab&family=Patua+One&family=Crete+Round&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground antialiased">
        <FirebaseClientProvider>
          <FontProvider>
            {children}
            <Toaster />
          </FontProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
