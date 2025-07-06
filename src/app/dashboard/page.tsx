import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "~/server/auth/config";
import { MapComponent } from "~/components/MapComponent";
import type { Session } from "next-auth";

export default async function DashboardPage() {
  // Explizite Typisierung der Session
  const session = await getServerSession(authConfig) as Session & {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "ADMIN" | "USER" | "PENDING";
    };
  };

  console.log("🔍 Dashboard - Session gefunden:", !!session);
  console.log("🔍 Dashboard - Session Details:", session ? {
    email: session.user?.email,
    role: session.user?.role,
    name: session.user?.name
  } : "Keine Session");

  if (!session?.user) {
    console.log("❌ Dashboard - Keine Session, leite zur Auth-Seite weiter");
    redirect("/auth");
  }

  // Typ-sichere Extraktion der Benutzerdaten
  const userName = session.user.name ?? session.user.email ?? "Benutzer";
  const userImage = session.user.image ?? undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                GeoPol Stuttgart
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Willkommen, {userName}
              </span>
              <a
                href="/api/auth/signout"
                className="text-sm text-red-600 hover:text-red-800"
              >
                Abmelden
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Polizeistationen in Stuttgart
          </h2>
          <div className="h-96 rounded-lg overflow-hidden border">
            <MapComponent />
          </div>
        </div>
      </main>
    </div>
  );
}
