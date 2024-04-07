const express = require('express');
const router = express.Router();
const prisma = require('./prismaClient');
const jwt = require('jsonwebtoken');


router.post('/', async(req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.json(newUser);
  }catch(error) {
    res.status(400).json({ error: `Could not create user: ${error.message}`});
  }
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email}});
    if(!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password.'});
    }
    const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET, { expiresIn: '24h'});
    res.json({ token, userId: user.id, email: user.email});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;