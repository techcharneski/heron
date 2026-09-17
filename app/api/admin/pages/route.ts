import { NextResponse } from "next/server";
import { getPagesContent, savePagesContent } from "@/lib/content";

export async function GET() {
  try {
    const data = await getPagesContent();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao ler páginas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const pagesData = await request.json();
    await savePagesContent(pagesData);
    return NextResponse.json({ success: true, message: "Páginas atualizadas com sucesso" });
  } catch (error) {
    console.error("Save pages error:", error);
    return NextResponse.json({ error: "Erro ao salvar páginas" }, { status: 500 });
  }
}
