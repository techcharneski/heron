import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://odvntvzicsetvlrpjswk.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdm50dnppY3NldHZscnBqc3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTU4NTE1NiwiZXhwIjoyMTA1MTYxMTU2fQ.ckp5ZGKLbVIFHf4Ch9AC3UKLYpXJ8VwsYt23X6N700c";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function main() {
  console.log("Inicializando Supabase para o projeto Heron...");

  // 1. Criar tabela de conteúdo via SQL endpoint RPC / rest se possível, ou testar upsert
  // Vamos verificar se conseguimos fazer um query na tabela site_content
  const { data, error } = await supabase.from("site_content").select("key").limit(1);

  if (error && error.code === "PGRST301" || error?.message?.includes("does not exist")) {
    console.log("Tabela site_content não existe. Vamos criá-la via SQL...");
  } else if (error) {
    console.log("Status da busca na tabela site_content:", error);
  } else {
    console.log("Tabela site_content existe!", data);
  }

  // 2. Garantir bucket 'uploads'
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error("Erro ao listar buckets:", bucketError);
  } else {
    const uploadsBucket = buckets.find(b => b.name === "uploads");
    if (!uploadsBucket) {
      console.log("Criando bucket público 'uploads'...");
      const { data: newBucket, error: createError } = await supabase.storage.createBucket("uploads", {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });
      if (createError) {
        console.error("Erro ao criar bucket 'uploads':", createError);
      } else {
        console.log("Bucket 'uploads' criado com sucesso!");
      }
    } else {
      console.log("Bucket 'uploads' já existe.");
    }
  }

  // 3. Importar arquivos de content/ para site_content
  const contentDir = path.join(process.cwd(), "content");
  const files = await fs.readdir(contentDir);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const key = file.replace(".json", "");
    const content = await fs.readFile(path.join(contentDir, file), "utf8");
    const json = JSON.parse(content);

    const { error: upsertError } = await supabase
      .from("site_content")
      .upsert({ key, data: json, updated_at: new Date().toISOString() }, { onConflict: "key" });

    if (upsertError) {
      console.error(`Erro ao salvar ${key} no Supabase:`, upsertError.message);
    } else {
      console.log(`Sucesso ao importar ${key} para o Supabase!`);
    }
  }
}

main().catch(console.error);
