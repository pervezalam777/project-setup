import express, { Request, Response } from 'express';
import path from 'path';
import apiRoutes from './routes/api';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory (where frontend build will go)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Backend API routes
app.use('/api', apiRoutes);

// Catch-all to serve the frontend's index.html for any other routes
// This allows client-side routing to work
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
  console.log(`Frontend served from http://localhost:${port}`);
  console.log(`API available at http://localhost:${port}/api`);
});