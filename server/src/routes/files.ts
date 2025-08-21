import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get files endpoint' });
});

router.post('/upload', (req, res) => {
  res.json({ message: 'Upload file endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get file endpoint' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete file endpoint' });
});

export default router;
