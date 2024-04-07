const express = require('express');
const router = express.Router();
const prisma = require('./prismaClient');

router.get('/', async(req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviews: {
          incluse: {
            iser: true,
          }
        }
      }
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    } 

    const averageRating = item.reviews.reduce((acc, curr) => acc + curr.rating, 0) / item.review.length;

    res.json({...item, averageRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async(req, res) => {
  const { serach } = req.query;
  try {
    const queryOptions = search ? {
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive'}},
        ],
      },
    } : {};

    const items = await prisma.items.findMany({
      ...queryOptions,
      include: {
        reviews: true
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;