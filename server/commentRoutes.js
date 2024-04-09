const express = require('express');
const router = express.Router();
const prisma = require('./prismaClient');
const authenticateToken = require('./authenticateToken');

router.post('/comments', authenticateToken, async(req, res) => {
  const { reviewId, text } = req.body;
  const userId = req.userId;

  const reviewExists = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if(!reviewExists) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  const comment = await prisma.comment.create({
    data: {
      text, 
      userId: userId,
      reviewId,
    },
  });
  res.json(comment);
});

router.get('/comments/mine', authenticateToken, async(req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        user: true, 
        review: true
      },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

router.delete('/comments/:id', authenticateToken, async(req, res)=> {
  const { id } = req.params;
  const userId = req.userId;

  const comment = await prisma.comment.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if(!comment || comment.userId !== userId) {
    return res.status(404).json({ error: 'Comment not found, or you are not authorized to remove.' });
  }
  await prisma.comment.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.json({ message: 'Comment deleted.' });
 });

 router.put('/comments/:id', authenticateToken, async(req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.userId;

  const comment = await prisma.comment.findUnique({
    where: {
      id: parseInt(id),
    }
  });
  if(!comment || comment.userId !== userId) {
    return res.status(404).json({ error: 'Comment not found, or you are not authorized to update.' });
  }
  const updateComment = await prisma.comment.update({
    where: {
      id: parseInt(id),
    },
    data: {
      text,
    },
  });
  res.json(updateComment);
 })

module.exports = router;