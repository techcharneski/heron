import bcrypt from "bcryptjs";

const pass = "heron2026admin";
const expectedUser = "admin";
const envPass = "heron2026admin";
const envHash = "$2b$10$PL.btPfqDda.9WvoaA83ge5B96GVuFijp9SqOhNyr8PlyYU1gZ/ye";

async function test() {
  console.log("Teste 1 (Direct match):", pass === envPass);
  console.log("Teste 2 (Bcrypt match):", await bcrypt.compare(pass, envHash));
}

test();
