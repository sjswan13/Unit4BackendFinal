const express = require('express');
const router = express.Router();
const prisma = require('./prismaClient');

router.get('/', async(req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {user: true, item: true},
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reviews', async(req, res)=> {
  const { userId, itemId, text, rating } = req.body;

  const existingReviewFromUser = await prisma.review.findFirst({
    where: {
      userId: userId,
      itemId: itemId.id,
    },
  });
  if(existingReviewFromUser) {
    return res.status(400).json({ error: 'You have already reviewed this item.'});
  }
  const review = await prisma.review.create({
    data: {
      text, 
      rating,
      userId,
      itemId,
    },
  });
  res.json(review);
});

router.get('/revioews/mine', async(req, res) => {
  const { userId } = req.query;

  const reviews = await prisma.review.findMany({
    where: {
      userId: userId,
    },
    include: {
      item: true,
    },
  });
  res.json(reviews);
});

router.delete('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  const review = await prisma.review.findUnique(P{ where: {
    id: parseInt(id),
  }});
  if(!review || review.userId !== userId) {
    return res.status(404).json({error: "Revew not found or you are not authorized to remove."});
  }
});

router.put('/reviews/:id', async (req, res) => {
  const { id } = req.params, 
  const { userId, text, rating} = req.body;

  const review = await prisma.review.findUnique({
    where: {
      id: parseInt(id)
    }
  });
  if(!review || review.userId !== userId) {
    return res.status(404).json({error: "Review not found or you are not authorized to edit"})
  }
    const updateReview = await prisma.review.update({
      where: {
        id: parseInt(id),
        data: { text, rating },
      }
    });
    res.json(updateReview);
})


module.exports = router;