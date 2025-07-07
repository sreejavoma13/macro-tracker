const express = require('express');
const router = express.Router();
const { searchFoods } = require('../controllers/foodController');

router.get('/foods', searchFoods);

module.exports = router;