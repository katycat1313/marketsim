import express from 'express';
import bodyParser from 'body-parser';
import { log, setupVite, serveStatic } from './vite';
import { registerRoutes } from './routes';

async function main() {
  const app = express();
  const port = 5000; // Always serve on port 5000

  app.use(bodyParser.json());

  // Register API routes
  const server = await registerRoutes(app);

  // Set up Vite for development
  if (process.env.NODE_ENV !== 'production') {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start the server
  server.listen(port, '0.0.0.0', () => {
    log(`Server is running on http://0.0.0.0:${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});