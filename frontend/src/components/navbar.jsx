// src/app/components/navbar.jsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
export default function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">BuySmart</Link>
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-slate-700 hover:text-indigo-600">Home</Link>
          <Link href="/about" className="text-slate-700 hover:text-indigo-600">About</Link>
          <Link href="/contact" className="text-slate-700 hover:text-indigo-600">Contact</Link>
          <Link href="/user/history" className="text-slate-700 hover:text-indigo-600">Comparison History</Link>
          <Button className="bg-red-600 hover:bg-red-700 text-white">Log Out</Button>
        </div>
      </div>
    </nav>
  );
}