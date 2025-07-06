import Link from "next/link";
import Map from "./_components/Map";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">🚔 GeoPol</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/map"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Vollbild-Karte
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Baden-Württemberg Polizei-Karte</h2>
          <p className="text-gray-600">
            Interaktive Karte für Polizeistationen und Einsatzgebiete in Baden-Württemberg
          </p>
        </div>

        <div className="h-[600px] w-full overflow-hidden rounded-xl border border-gray-300 shadow-lg">
          <Map />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📍 Standort</h3>
            <p className="text-gray-600">Zentriert auf Pforzheim, Baden-Württemberg</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🗺️ Navigation</h3>
            <p className="text-gray-600">Zoom, Rotation und Skala verfügbar</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Nächste Schritte</h3>
            <p className="text-gray-600">Polizeistationen als Marker hinzufügen</p>
          </div>
        </div>
      </div>
    </main>
  );
}
