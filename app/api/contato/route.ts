import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { nome, email, demanda } = await request.json();

    // 1. Validation
    if (!nome || !email || !demanda) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios (nome, email, demanda) devem ser preenchidos." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Endereço de e-mail corporativo inválido." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_RECEIVER_EMAIL || "contato@charneski.com.br";

    // 2. Sending mail
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
          subject: `Nova Demanda Acadêmica/Profissional: ${nome}`,
          html: `
            <h3>Nova Demanda Registrada no Site</h3>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Descrição da Demanda:</strong></p>
            <p style="white-space: pre-wrap; font-family: sans-serif; line-height: 1.5; color: #1a1a1a;">${demanda}</p>
          `,
        }),
      });

      if (!resendResponse.ok) {
        const errDetails = await resendResponse.text();
        console.error("Resend API Error details:", errDetails);
        throw new Error("Falha no serviço Resend ao despachar o e-mail.");
      }

      return NextResponse.json({ success: true, message: "E-mail enviado via Resend com sucesso." });
    } else {
      // 3. Fallback for testing/local development without keys
      console.log("----------------------------------------");
      console.log("[SIMULAÇÃO DE ENVIO DE E-MAIL - RESEND]");
      console.log(`Para: ${toEmail}`);
      console.log(`Assunto: Nova Demanda: ${nome}`);
      console.log(`E-mail do remetente: ${email}`);
      console.log(`Descrição: ${demanda}`);
      console.log("----------------------------------------");

      // Small mock delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      return NextResponse.json({
        success: true,
        message: "E-mail simulado com sucesso (RESEND_API_KEY ausente).",
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
