const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('./server/userRoutes')
const reviewRoutes = require('./server/reviewRoutes');
const itemRoutes = require('./server/itemRoutes');
const commentRoutes = require('./server/commentRoutes');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/items', itemRoutes);
app.use('/comments', commentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})