// app/layout.tsx
import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <nav className="bg-green-600 p-4 text-white flex justify-around">
          <Link href="/" className="font-bold">Dashboard</Link>
          <Link href="/emissions">Emissions</Link>
          <Link href="/users">Users</Link>
          <Link href="/recommendations">Recommendations</Link>
        </nav>
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
