import { NextResponse } from "next/server";
import { getCollection, saveCollection, CollectionName } from "@/lib/content";

const VALID_COLLECTIONS: CollectionName[] = [
  "articles",
  "books",
  "press",
  "presentations",
  "publications",
  "temas",
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  if (!VALID_COLLECTIONS.includes(name as CollectionName)) {
    return NextResponse.json({ error: "Coleção inválida" }, { status: 400 });
  }

  try {
    const items = await getCollection(name as CollectionName);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar coleção ${name}` }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  if (!VALID_COLLECTIONS.includes(name as CollectionName)) {
    return NextResponse.json({ error: "Coleção inválida" }, { status: 400 });
  }

  try {
    const items = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Os dados da coleção devem ser uma lista (array)" }, { status: 400 });
    }

    await saveCollection(name as CollectionName, items);
    return NextResponse.json({ success: true, message: `Coleção ${name} salva com sucesso` });
  } catch (error) {
    console.error(`Error saving collection ${name}:`, error);
    return NextResponse.json({ error: `Erro ao salvar coleção ${name}` }, { status: 500 });
  }
}
