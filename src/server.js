require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Start the server after connecting to MongoDB
 */
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start listening only after DB connection succeeds
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Todos API: http://localhost:${PORT}/api/todos`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
