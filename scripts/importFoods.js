const dotenv=require('dotenv')
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Food = require('../models/Food');
const connectDB = require('../config/db.js');

dotenv.config({ path: '../.env' });

connectDB();

const results = [];

fs.createReadStream('../data/foods.csv')
  .pipe(csv())
  .on('data', (row) => {
    results.push({
      name: row.name,
      serving_unit: row.serving_unit,
      calories_per_unit: parseFloat(row.calories_per_unit),
      protein_per_unit: parseFloat(row.protein_per_unit),
      carbs_per_unit: parseFloat(row.carbs_per_unit),
      fat_per_unit: parseFloat(row.fat_per_unit),
      is_veg: row.is_veg.toLowerCase() === 'true'
    });
  })
  .on('end', async () => {
    try {
      await Food.insertMany(results);
      console.log('Imported food data');
      process.exit();
    } catch (err) {
      console.error('Error:', err);
      process.exit(1);
    }
  });