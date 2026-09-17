import { NextResponse } from "next/server";
import { addLead } from "@/lib/content";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, instituicao, assunto, mensagem, demanda } = body;

    const mensagemText = mensagem || demanda;

    // 1. Validation
    if (!nome || !email || !mensagemText) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios (nome, email, mensagem) devem ser preenchidos." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Endereço de e-mail corporativo/acadêmico inválido." },
        { status: 400 }
      );
    }

    // 2. Salvar lead no Supabase (Painel Admin)
    try {
      await addLead({
        nome,
        email,
        instituicao: instituicao || "",
        assunto: assunto || "outro",
        mensagem: mensagemText,
      });
    } catch (saveError) {
      console.error("Erro ao salvar lead no Supabase:", saveError);
      // Continuamos o fluxo para que o usuário não seja travado caso haja problema no banco
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_RECEIVER_EMAIL || "contato@charneski.com.br";

    // 3. Sending mail
    if (apiKey) {
      // Execute the request via Resend REST API
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "Site Heron Charneski <onboarding@resend.dev>", // Resend's default testing domain or custom domain
          to: [toEmail],
          subject: `Novo Contato/Demanda: ${nome} (${assunto || "Geral"})`,
          html: `
            <h3>Nova Mensagem Recebida no Site</h3>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Instituição/Organização:</strong> ${instituicao || "Não informada"}</p>
            <p><strong>Assunto:</strong> ${assunto || "Não informado"}</p>
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap; font-family: sans-serif; line-height: 1.5; color: #1a1a1a;">${mensagemText}</p>
          `,
        }),
      });

      if (!resendResponse.ok) {
        const errDetails = await resendResponse.text();
        console.error("Resend API Error details:", errDetails);
        // Mesmo se o e-mail falhar, como o lead foi salvo, podemos dar uma mensagem informativa ou lançar erro se necessário
      }

      return NextResponse.json({
        success: true,
        message: "Mensagem enviada com sucesso e registrada no painel admin.",
      });
    } else {
      // Fallback for testing/local development without keys
      console.log("----------------------------------------");
      console.log("[SIMULAÇÃO DE ENVIO DE E-MAIL - RESEND]");
      console.log(`Para: ${toEmail}`);
      console.log(`Assunto: Novo Contato: ${nome}`);
      console.log(`E-mail do remetente: ${email}`);
      console.log(`Mensagem: ${mensagemText}`);
      console.log("----------------------------------------");

      // Small mock delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 500));

      return NextResponse.json({
        success: true,
        message: "Mensagem salva no painel admin e e-mail simulado com sucesso.",
      });
    }
  } catch (error: any) {
    console.error("Erro na rota de API de contato:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor ao processar contato." },
      { status: 500 }
    );
  }
}

