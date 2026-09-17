import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const originalName = body.filename || "arquivo.pdf";
    const contentType = body.contentType || "application/pdf";

    const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}_${sanitizedOriginalName}`;

    // Gerar URL assinada para upload direto pelo cliente
    const { data, error } = await supabaseAdmin.storage
      .from("uploads")
      .createSignedUploadUrl(filename);

    if (error || !data?.signedUrl) {
      console.error("Erro ao gerar signed URL no Supabase Storage:", error);
      return NextResponse.json(
        { error: `Erro ao preparar upload: ${error?.message || "Erro desconhecido"}` },
        { status: 500 }
      );
    }

    // Obter URL pública que o arquivo terá após o upload
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("uploads")
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      filename: originalName,
    });
  } catch (error: any) {
    console.error("Signed URL error:", error);
    return NextResponse.json(
      { error: "Erro ao gerar URL assinada de upload." },
      { status: 500 }
    );
  }
}
