const express = require('express');
const router = express.Router();
const prisma = require('./prismaClient');
const authenticateToken = require('./authenticateToken');

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

router.post('/reviews', authenticateToken, async(req, res)=> {
  const { itemId, text, rating } = req.body;
  const userId = req.userId;

  const existingReviewFromUser = await prisma.review.findFirst({
    where: {
      userId: userId,
      itemId: itemId,
    },
  });
  if(existingReviewFromUser) {
    return res.status(400).json({ error: 'You have already reviewed this item.'});
  }
  const review = await prisma.review.create({
    data: {
      text, 
      rating,
      userId: userId,
      itemId,
    },
  });
  res.json(review);
});

router.get('/reviews/mine', authenticateToken, async(req, res) => {
  const userId = req.userId;

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

router.delete('/reviews/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  
  const review = await prisma.review.findUnique({ 
    where: {
    id: parseInt(id),
  }});
  if(!review || review.userId !== userId) {
    return res.status(404).json({error: "Revew not found or you are not authorized to remove."});
  }
  await prisma.review.delete({
    where:{
      id: parseInt(id),
    },
  });
  res.json({ message: "Review successfully removed." })
});

router.put('/reviews/:id', authenticateToken, async (req, res) => {
  const { id } = req.params; 
  const { text, rating} = req.body;
  const userId = req.userId;

  const review = await prisma.review.findUnique({
    where: {
      id: parseInt(id)
    }
  });
  if(!review || review.userId !== userId) {
    return res.status(404).json({error: "Review not found or you are not authorized to edit"});
  }
  const updatedReview = await prisma.review.update({
      where: {
        id: parseInt(id),
      },
      data: { 
        text, 
        rating,
       },
    });
    res.json(updatedReview);
})


module.exports = router;