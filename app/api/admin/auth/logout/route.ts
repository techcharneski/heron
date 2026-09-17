import { NextResponse } from "next/server";
import { removeSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    await removeSessionCookie();
    return NextResponse.json({ success: true, message: "Logout realizado com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao realizar logout" }, { status: 500 });
  }
}
