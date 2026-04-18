import postgres from 'postgres';
import fs from 'node:fs';
import path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DIRECT_URL;
if (!DATABASE_URL) {
  console.error('❌ Помилка: DIRECT_URL не знайдено в .env файлі');
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function initializeDatabase() {
  try {
    const sqlPath = path.join(process.cwd(), 'db', 'init.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error(`❌ Помилка: Файл не знайдено за шляхом ${sqlPath}`);
      process.exit(1);
    }
    const query = fs.readFileSync(sqlPath, 'utf8');
    console.log('⏳ Підключення до бази даних та виконання скрипту...');
    await sql.unsafe(query);
    console.log('✅ База даних успішно ініціалізована!');
  } catch (error) {
    console.error('❌ Помилка під час ініціалізації:');
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}
initializeDatabase();