import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import assert from "assert";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://odvntvzicsetvlrpjswk.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdm50dnppY3NldHZscnBqc3drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTU4NTE1NiwiZXhwIjoyMTA1MTYxMTU2fQ.ckp5ZGKLbVIFHf4Ch9AC3UKLYpXJ8VwsYt23X6N700c";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function verify() {
  console.log("=== VERIFICAÇÃO DE IGUALDADE PROFUNDA (DEEP EQUALITY) ===");
  const contentDir = path.join(process.cwd(), "content");
  const files = await fs.readdir(contentDir);

  const results: Array<{ coleção: string; quantidadeItens: number; dadosIdênticos: string }> = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const key = file.replace(".json", "");
    const jsonStr = await fs.readFile(path.join(contentDir, file), "utf8");
    const jsonObj = JSON.parse(jsonStr);

    const { data: dbRow, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("key", key)
      .single();

    if (error || !dbRow) {
      results.push({ coleção: key, quantidadeItens: 0, dadosIdênticos: "❌ Não encontrado" });
      continue;
    }

    const dbObj = dbRow.data;

    let isIdentical = true;
    try {
      assert.deepStrictEqual(jsonObj, dbObj);
    } catch (e) {
      isIdentical = false;
    }

    const count = Array.isArray(jsonObj) ? jsonObj.length : Object.keys(jsonObj).length;

    results.push({
      coleção: key,
      quantidadeItens: count,
      dadosIdênticos: isIdentical ? " Sim (100% exato)" : "❌ Diferença detectada",
    });
  }

  console.table(results);
}

verify().catch(console.error);
