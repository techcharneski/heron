import { NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/content";

export async function GET() {
  try {
    const data = await getSiteSettings();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao ler configurações" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const settingsData = await request.json();
    await saveSiteSettings(settingsData);
    return NextResponse.json({ success: true, message: "Configurações atualizadas com sucesso" });
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 });
  }
}
