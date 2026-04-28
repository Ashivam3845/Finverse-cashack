import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: 'FinFlow AI | Gen-Z Financial Super App',
  description: 'AI-powered financial super app for investments and tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${jetbrains.variable} font-sans antialiased text-foreground bg-background`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
