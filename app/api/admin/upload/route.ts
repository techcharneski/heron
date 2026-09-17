import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { MAX_IMAGE_SIZE_BYTES, MAX_PDF_SIZE_BYTES, isPdf } from "@/lib/upload-utils";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const fileIsPdf = isPdf(file.name, file.type);
    const maxAllowedBytes = fileIsPdf ? MAX_PDF_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    const maxMB = fileIsPdf ? 10 : 4;

    if (file.size > maxAllowedBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const toolText = fileIsPdf
        ? "iLovePDF (https://www.ilovepdf.com/pt/comprimir_pdf) ou Smallpdf"
        : "TinyPNG (https://tinypng.com), iLoveIMG ou Squoosh";

      return NextResponse.json(
        {
          error: `O arquivo excede o limite máximo de ${maxMB} MB (Tamanho atual: ${sizeMB} MB). Por favor, comprima o arquivo em sites como ${toolText} antes de fazer o upload.`,
          isSizeError: true,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}_${sanitizedOriginalName}`;

    // Upload direto para o bucket 'uploads' no Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("uploads")
      .upload(filename, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      console.error("Erro no upload do Supabase Storage:", uploadError);
      return NextResponse.json(
        { error: `Erro ao enviar arquivo para o Supabase: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Obter URL pública do arquivo
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("uploads")
      .getPublicUrl(filename);

    const publicUrl = publicUrlData.publicUrl;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      name: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erro ao processar upload do arquivo" }, { status: 500 });
  }
}
