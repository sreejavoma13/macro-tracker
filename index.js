const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();
const app = express();

app.use(express.json());


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const diaryRoutes = require('./routes/diaryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);  
app.use('/api', foodRoutes); 
app.use('/api', diaryRoutes);  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});