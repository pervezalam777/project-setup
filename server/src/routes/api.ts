import { Router, Request, Response } from 'express';

const router = Router();

router.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend API!' });
});

router.post('/echo', (req: Request, res: Response) => {
  const { message } = req.body;
  res.json({ received: message, timestamp: new Date().toISOString() });
});

export default router;