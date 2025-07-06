"use client";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          GeoPol Stuttgart
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Polizei-Einsatzleitsystem für Baden-Württemberg
        </p>
      </div>
    </div>
  );
}
