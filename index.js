const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('./server/userRoutes')
const reviewRoutes = require('./server/reviewRoutes');
const itemRoutes = require('./server/itemRoutes');

app.use(express.json());

app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/items', itemRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})