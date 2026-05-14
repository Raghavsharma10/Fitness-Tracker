import { Client } from '@neondatabase/serverless';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is missing.');
    console.log('Please copy .env.example to .env and add your database URL.');
    process.exit(1);
  }

  const client = new Client(connectionString);

  try {
    await client.connect();
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf-8');

    console.log('Running schema migration...');
    
    await client.query(schemaSql);
    
    console.log('✅ Database initialized successfully!');
    console.log('You are now ready to run the app with PostgreSQL.');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDb();
