import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { LogIn, Mail, Lock } from "lucide-react";

export function LoginForm() {
  return (
    <form className="mx-auto w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow">
      <h1 className="text-center text-2xl font-semibold">Melden Sie sich an</h1>

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
  );
}
