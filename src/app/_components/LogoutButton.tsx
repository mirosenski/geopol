"use client";

import { signOut } from "next-auth/react";
import { Button } from "../../components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => signOut({ callbackUrl: "/auth" })}
    >
      <LogOut className="h-4 w-4" />
      Abmelden
    </Button>
  );
}
