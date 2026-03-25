import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Plantry | Jamaican Plant-Based Provisions',
  description: 'Fresh organic plant-based provisions from Jamaica',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-stone-50 text-stone-900" style={{ fontFamily: 'Inter, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
