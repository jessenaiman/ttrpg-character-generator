import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TTRPG Character Generator',
  description: 'AI-powered tabletop RPG character generator supporting D&D 5e, Pathfinder 2e, and Blades in the Dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}