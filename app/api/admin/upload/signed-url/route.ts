import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { MAX_IMAGE_SIZE_BYTES, MAX_PDF_SIZE_BYTES, isPdf } from "@/lib/upload-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const originalName = body.filename || "arquivo.pdf";
    const contentType = body.contentType || "application/pdf";
    const fileSize = typeof body.fileSize === "number" ? body.fileSize : undefined;

    const fileIsPdf = isPdf(originalName, contentType);
    const maxAllowedBytes = fileIsPdf ? MAX_PDF_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    const maxMB = fileIsPdf ? 10 : 4;

    if (fileSize && fileSize > maxAllowedBytes) {
      const sizeMB = (fileSize / (1024 * 1024)).toFixed(1);
      const toolText = fileIsPdf
        ? "iLovePDF (https://www.ilovepdf.com/pt/comprimir_pdf) ou Smallpdf"
        : "TinyPNG (https://tinypng.com), iLoveIMG ou Squoosh";

      return NextResponse.json(
        {
          error: `O arquivo excede o limite máximo de ${maxMB} MB (Tamanho atual: ${sizeMB} MB). Por favor, comprima o arquivo em sites como ${toolText} antes de fazer o upload.`,
        },
        { status: 400 }
      );
    }

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
