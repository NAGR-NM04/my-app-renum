import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/index.js";

// PostgreSQL に接続するためのコネクションプールとアダプター
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

async function main() {
  console.log("データベースに接続中...");
  // ユーザーを 1 件追加してみる
  await prisma.user.create({
    data: { name: `わんこ仙人 ${new Date().toLocaleTimeString()}` },
  });
  // 一覧を取得して表示
  const users = await prisma.user.findMany();
  console.log("ユーザー一覧:", users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => Promise.all([prisma.$disconnect(), pool.end()]));
