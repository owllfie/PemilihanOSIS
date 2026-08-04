require('dotenv').config();

const app = require('./src/app');
const db = require('./src/config/db');

const PORT = process.env.PORT || 3000;

async function connectWithRetry(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await db.$connect();
      console.log('Connected to PostgreSQL.');
      return;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed. Retrying in ${delay / 1000}s...`);
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function main() {
  try {
    await connectWithRetry();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database after all retries:', err);
    process.exit(1);
  }
}

main();
