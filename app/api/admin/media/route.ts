import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from("uploads")
      .list("", {
        limit: 1000,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Erro ao listar mídias do Supabase Storage:", error);
      return NextResponse.json(
        { error: `Erro ao listar arquivos: ${error.message}` },
        { status: 500 }
      );
    }

    // Filtrar pasta placeholder caso exista
    const files = (data || []).filter(
      (file) => file.name !== ".emptyFolderPlaceholder"
    );

    // Mapear cada arquivo com sua URL pública
    const mediaItems = files.map((file) => {
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("uploads")
        .getPublicUrl(file.name);

      return {
        id: file.id || file.name,
        name: file.name,
        url: publicUrlData.publicUrl,
        size: (file.metadata as any)?.size ?? (file as any).size ?? 0,
        created_at: file.created_at || file.updated_at || new Date().toISOString(),
        mimetype: (file.metadata as any)?.mimetype || null,
      };
    });

    return NextResponse.json(mediaItems);
  } catch (error: any) {
    console.error("Media list error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar lista de mídias." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let name = searchParams.get("name");

    if (!name) {
      const body = await request.json().catch(() => ({}));
      name = body.name || body.filename;
    }

    if (!name) {
      return NextResponse.json(
        { error: "Nome do arquivo é obrigatório." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.storage
      .from("uploads")
      .remove([name]);

    if (error) {
      console.error("Erro ao excluir mídia do Supabase Storage:", error);
      return NextResponse.json(
        { error: `Erro ao excluir arquivo: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Arquivo excluído com sucesso." });
  } catch (error: any) {
    console.error("Media delete error:", error);
    return NextResponse.json(
      { error: "Erro ao excluir arquivo de mídia." },
      { status: 500 }
    );
  }
}
