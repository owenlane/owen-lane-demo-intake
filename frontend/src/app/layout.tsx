import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bright Smile Dental — Patient Intake',
  description: 'Secure digital patient intake form for Bright Smile Dental',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800">{children}</body>
    </html>
  );
}
