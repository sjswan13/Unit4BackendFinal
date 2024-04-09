const express = require('express');
const router = express.Router();
const prisma = require('./prismaClient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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
  const {email, password: plainTextPassword} = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email }});
    if(user && await bcrypt.compare(plaintextPassword, user.password)) {
      const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET, { expiresIn: '24h'});
      res.json({ token, userId: user.id, email: user.email});
      return res.status(401).json({ error: 'Login Successful.'});
    } else {
      res.status(401).json({error: "invalid email or password."})
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;