"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <span className="text-xl font-bold text-blue-900">GeoPol Stuttgart</span>
          <Link
            href="/auth"
            className="inline-block px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Anmelden
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 mt-12">
          GeoPol Stuttgart
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Polizei-Einsatzleitsystem für Baden-Württemberg
        </p>
        <Link
          href="/auth"
          className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
        >
          Jetzt anmelden
        </Link>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} GeoPol Stuttgart &ndash; Polizei-Einsatzleitsystem
        </div>
      </footer>
    </div>
  );
}
