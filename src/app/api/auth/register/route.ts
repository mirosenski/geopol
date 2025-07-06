import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "~/server/db";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validierung
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Passwort muss mindestens 6 Zeichen lang sein" },
        { status: 400 }
      );
    }

    // Prüfe, ob E-Mail bereits existiert
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "E-Mail-Adresse bereits registriert" },
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
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registrierungsfehler:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}
