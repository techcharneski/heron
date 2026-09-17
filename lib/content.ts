import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Helper genérico para ler conteúdo por chave (Supabase Postgres)
export async function getContentByKey<T>(
  key: string,
  fallbackFilename?: string,
  defaultValue?: T
): Promise<T> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_content")
      .select("data")
      .eq("key", key)
      .maybeSingle();

    if (!error && data?.data !== undefined && data?.data !== null) {
      return data.data as T;
    }
  } catch (error) {
    console.error(`Erro ao buscar chave '${key}' no Supabase:`, error);
  }

  // Fallback seguro caso o banco ainda não responda e o arquivo local exista
  if (fallbackFilename) {
    const filePath = path.join(CONTENT_DIR, fallbackFilename);
    try {
      const fileData = await fs.readFile(filePath, "utf8");
      return JSON.parse(fileData) as T;
    } catch {
      // Arquivo local pode não existir mais
    }
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Could not load content for key '${key}'`);
}

// Helper genérico para salvar conteúdo por chave no Supabase Postgres
export async function saveContentByKey<T>(key: string, data: T): Promise<void> {
  const { error } = await supabaseAdmin
    .from("site_content")
    .upsert({ key, data, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) {
    console.error(`Erro ao salvar chave '${key}' no Supabase:`, error);
    throw new Error(`Could not save content for key '${key}': ${error.message}`);
  }
}

// Mapeamento de coleções
export type CollectionName =
  | "articles"
  | "books"
  | "press"
  | "presentations"
  | "publications"
  | "temas";

// Mapeamento de caminhos para revalidação
const COLLECTION_PATHS: Record<CollectionName, string[]> = {
  articles: ["/", "/artigos"],
  books: ["/", "/livros"],
  press: ["/", "/imprensa"],
  presentations: ["/", "/apresentacoes"],
  publications: ["/", "/producao-academica"],
  temas: ["/", "/temas-de-pesquisa", "/producao-academica"],
};

export async function getCollection<T = any>(collection: CollectionName): Promise<T[]> {
  try {
    const data = await getContentByKey<T[]>(collection, `${collection}.json`, []);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function saveCollection<T = any>(
  collection: CollectionName,
  items: T[]
): Promise<void> {
  await saveContentByKey(collection, items);

  // Revalidação do cache Next.js
  const paths = COLLECTION_PATHS[collection] || ["/"];
  for (const p of paths) {
    revalidatePath(p);
    revalidatePath(p, "layout");
  }
}

// Helpers para conteúdo de páginas
export async function getPagesContent() {
  return getContentByKey<any>("pages", "pages.json", {});
}

export async function savePagesContent(pagesData: any) {
  await saveContentByKey("pages", pagesData);
  revalidatePath("/");
  revalidatePath("/sobre");
  revalidatePath("/pareceres");
  revalidatePath("/servicos");
  revalidatePath("/contato");
}

// Helpers para configurações do site
export async function getSiteSettings() {
  return getContentByKey<any>("settings", "settings.json", {});
}

export async function saveSiteSettings(settingsData: any) {
  await saveContentByKey("settings", settingsData);
  revalidatePath("/", "layout");
}
