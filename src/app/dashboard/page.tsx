import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Map, User } from "lucide-react";
import UserAvatarWrapper from "../_components/UserAvatarWrapper";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";

export default async function DashboardPage() {
  const headersList = await headers();
  const token = await getToken({
    req: { headers: headersList } as any,
    secret: process.env.AUTH_SECRET
  });

  if (!token?.email) {
    redirect("/auth");
  }

  const userName = token.name ?? token.email ?? "Benutzer";
  const userImage = token.picture ?? undefined;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Willkommen, {userName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Karte
            </Button>
            <UserAvatarWrapper name={userName} image={userImage} />
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Schnellzugriff</h2>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Map className="mr-2 h-4 w-4" />
                Kartenansicht öffnen
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User className="mr-2 h-4 w-4" />
                Benutzerprofil
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Letzte Aktivitäten</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Anmeldung erfolgreich</p>
              <p>• Dashboard geladen</p>
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">System-Status</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentifizierung</span>
                <span className="text-sm text-green-600">✓ Aktiv</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Datenbank</span>
                <span className="text-sm text-green-600">✓ Verbunden</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
