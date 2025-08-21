import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get pages endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create page endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get page endpoint' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update page endpoint' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete page endpoint' });
});

export default router;
