"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { LogIn, Mail, Lock, Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow">
      <h1 className="text-center text-2xl font-semibold">Melden Sie sich an</h1>

      {/* GitHub Login Button */}
      <Button
        onClick={handleGitHubLogin}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800"
      >
        <Github className="h-5 w-5" />
        {isLoading ? "Anmeldung läuft..." : "Mit GitHub anmelden"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">oder</span>
        </div>
      </div>

      {/* Traditional Form */}
      <form className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            E-Mail-Adresse
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="z. B. max.mustermann@bw.de"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Passwort
          </Label>
          <Input id="password" type="password" placeholder="********" />
        </div>

        <Button
          type="submit"
          className="flex w-full items-center justify-center gap-2"
        >
          <LogIn className="h-5 w-5" />
          Anmelden
        </Button>
      </form>
    </div>
  );
}
