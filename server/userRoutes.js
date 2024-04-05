const express = require('express');
const router = express.Router();
const prisma = require('./prismaClient');


router.post('/', async(req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    });
    res.json(newUser);
  }catch(error) {
    res.status(400).json({ error: `Could not create user: ${error.message}`});
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

module.exports = router;