import { Router } from 'express';

const router = Router();

router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile endpoint' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update user profile endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get user endpoint' });
});

export default router;
