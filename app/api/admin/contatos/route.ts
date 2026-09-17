import { NextResponse } from "next/server";
import { getLeadsContent, saveLeadsContent, LeadItem } from "@/lib/content";

export async function GET() {
  try {
    const leads = await getLeadsContent();
    return NextResponse.json(leads);
  } catch (error: any) {
    console.error("Erro ao buscar leads:", error);
    return NextResponse.json({ error: "Erro ao carregar contatos." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, lido, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID do lead é obrigatório." }, { status: 400 });
    }

    const leads = await getLeadsContent();
    let updated = false;

    const newLeads = leads.map((item) => {
      if (item.id === id) {
        updated = true;
        return {
          ...item,
          ...(lido !== undefined ? { lido: Boolean(lido) } : {}),
          ...(status ? { status } : {}),
        };
      }
      return item;
    });

    if (!updated) {
      return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });
    }

    await saveLeadsContent(newLeads);
    return NextResponse.json({ success: true, message: "Lead atualizado com sucesso.", leads: newLeads });
  } catch (error: any) {
    console.error("Erro ao atualizar lead:", error);
    return NextResponse.json({ error: "Erro ao atualizar lead." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "ID do lead é obrigatório." }, { status: 400 });
    }

    const leads = await getLeadsContent();
    const filteredLeads = leads.filter((item) => item.id !== id);

    await saveLeadsContent(filteredLeads);
    return NextResponse.json({ success: true, message: "Lead removido com sucesso.", leads: filteredLeads });
  } catch (error: any) {
    console.error("Erro ao excluir lead:", error);
    return NextResponse.json({ error: "Erro ao excluir lead." }, { status: 500 });
  }
}
