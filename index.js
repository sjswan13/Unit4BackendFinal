const express = require('express');
require('@prisma/client');
const app = express();
const port = 3000;
const userRoutes = require('./server/userRoutes')

app.use(express.json());

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})