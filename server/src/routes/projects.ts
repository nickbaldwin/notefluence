import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get projects endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create project endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get project endpoint' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update project endpoint' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete project endpoint' });
});

export default router;
