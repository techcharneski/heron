import { redirect, notFound } from "next/navigation";
import { getCollection } from "@/lib/content";
import { Publication } from "@/components/PublicationCard";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = (await getCollection("articles")) as unknown as Publication[];
  return articles.map((article) => ({
    slug: article.slug || article.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = (await getCollection("articles")) as unknown as Publication[];
  const article = articles.find(
    (a) => (a.slug || a.id) === slug
  );

  if (!article) {
    return {
      title: "Artigo Não Encontrado | Prof. Dr. Heron Charneski",
    };
  }

  return {
    title: `${article.titulo} | Prof. Dr. Heron Charneski`,
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const articles = (await getCollection("articles")) as unknown as Publication[];
  const article = articles.find(
    (a) => (a.slug || a.id) === slug
  );

  if (!article) {
    notFound();
  }

  if (article.pdfUrl) {
    redirect(article.pdfUrl);
  }

  redirect("/artigos");
}
