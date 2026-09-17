import { validateCredentials } from "../lib/auth";

async function test() {
  process.env.ADMIN_USERNAME = "admin";
  process.env.ADMIN_PASSWORD = "heron2026admin";

  const isValid = await validateCredentials("admin", "heron2026admin");
  console.log("Resultado da validação de login (admin / heron2026admin):", isValid);
}

test().catch(console.error);
