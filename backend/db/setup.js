const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    multipleStatements: true,
  });

  try {
    await connection.query(schema);
    console.log("Database 'flipkart' created/updated successfully.");
  } finally {
    await connection.end();
  }
}

setupDatabase().catch((error) => {
  console.error('Database setup failed:', error.message);
  process.exit(1);
});
