import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "~/server/db";

// Typen für Request-Daten
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Typen für Response-Daten
interface RegisterResponse {
  message?: string;
  error?: string;
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password }: RegisterRequest = await request.json();

    // Validierung
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich" } as RegisterResponse,
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Passwort muss mindestens 6 Zeichen lang sein" } as RegisterResponse,
        { status: 400 }
      );
    }

    // Prüfe, ob E-Mail bereits existiert
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "E-Mail-Adresse bereits registriert" } as RegisterResponse,
        { status: 400 }
      );
    }

    // Hash das Passwort
    const hashedPassword = await hash(password, 12);

    // Erstelle neuen Benutzer mit PENDING-Status
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "PENDING"
      }
    });

    return NextResponse.json(
      {
        message: "Registrierung erfolgreich. Bitte warte auf Admin-Genehmigung.",
        userId: user.id
      } as RegisterResponse,
      { status: 201 }
    );

  } catch (error) {
    console.error("Registrierungsfehler:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" } as RegisterResponse,
      { status: 500 }
    );
  }
}
