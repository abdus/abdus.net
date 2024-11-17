import { db } from "@vercel/postgres";

async function seed() {
  await db.query(`CREATE TABLE IF NOT EXISTS snowbell_chat_history (
    id SERIAL PRIMARY KEY,
    thread_id UUID NOT NULL,
    message TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log("Table created");
}

seed().catch((err) => console.error(err)).finally(() => db.end());
