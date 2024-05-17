// Load environment variables from .env file
require('dotenv').config();

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const mysql = require('mysql2/promise');
const http = require('http');

async function getSecret(key) {
  const secretName = `projects/${process.env.GCP_PROJECT_ID}/secrets/${key}/versions/latest`
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({ name: secretName });
  const payload = version.payload.data.toString();
  return payload;
}

async function main() {
  const user = await getSecret(process.env.DB_USER_SECRET_KEY);
  const password = await getSecret(process.env.DB_PASSWORD_SECRET_KEY);
  const database = await getSecret(process.env.DB_NAME_SECRET_KEY);

  const connectionConfig = {
    user: user,
    password: password,
    database: database,
    socketPath: process.env.ENV == "PROD"
      ? `/cloudsql/${process.env.GCP_CLOUD_SQL_INSTANCE_CONNECTION_NAME}`
      : undefined,
    host: process.env.ENV == "LOCAL" 
      ? undefined 
      : process.env.DB_HOST,
    port: process.env.ENV == "LOCAL" 
      ? undefined 
      : process.env.DB_PORT
  };

  try {
    // Create a connection to the database
    const connection = await mysql.createConnection(connectionConfig);

    // Test the connection with an example query
    const [rows, fields] = await connection.execute('SELECT 1 + 1 AS solution');
    console.log('Query result:', rows[0].solution);

    // Close the connection
    await connection.end();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

main().catch(console.error);


// the process below is not important
// it's just to keep the script/container running
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Server is running\n');
});

server.listen(8080, () => {
  console.log(`Your query is success, now it's listening to port 8080. Please stop the process with CTRL+C`);
});

// Handle process termination and cleanly close the server
const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);