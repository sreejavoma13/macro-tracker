const DiaryEntry = require('../models/DiaryEntry');
const WaterLog = require('../models/WaterLog');
const WeightLog = require('../models/WeightLog');
const Food = require('../models/Food');
const mongoose = require('mongoose');


exports.createDiaryEntry = async (req, res) => {
  try {
    const { food, quantity, meal_type, log_date } = req.body;

    const entry = new DiaryEntry({
      user: req.user.id,
      food,
      quantity,
      meal_type,
      log_date
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Error creating diary entry', error: err.message });
  }
};

exports.getDailyDashboard = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.id;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const diaryData = await DiaryEntry.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          log_date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $lookup: {
          from: 'foods',
          localField: 'food',
          foreignField: '_id',
          as: 'foodDetails'
        }
      },
      { $unwind: '$foodDetails' },
      {
        $group: {
          _id: '$user',
          total_calories: { $sum: { $multiply: ['$quantity', '$foodDetails.calories_per_unit'] } },
          total_protein: { $sum: { $multiply: ['$quantity', '$foodDetails.protein_per_unit'] } },
          total_carbs: { $sum: { $multiply: ['$quantity', '$foodDetails.carbs_per_unit'] } },
          total_fat: { $sum: { $multiply: ['$quantity', '$foodDetails.fat_per_unit'] } }
        }
      }
    ]);

    const water = await WaterLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          log_date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: '$user',
          total_water: { $sum: '$quantity_ml' }
        }
      }
    ]);

    const weight = await WeightLog.findOne({
      user: userId,
      log_date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ log_date: -1 });

    res.status(200).json({
      ...diaryData[0],
      total_water: water[0]?.total_water || 0,
      weight_kg: weight?.weight_kg || null
    });

  } catch (err) {
    res.status(500).json({ message: 'Dashboard error', error: err.message });
  }
};
exports.logWater = async (req, res) => {
  try {
    const { quantity_ml, log_date } = req.body;
    const entry = new WaterLog({ user: req.user.id, quantity_ml, log_date });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Error logging water', error: err.message });
  }
};

exports.logWeight = async (req, res) => {
  try {
    const { weight_kg, log_date } = req.body;
    const entry = new WeightLog({ user: req.user.id, weight_kg, log_date });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Error logging weight', error: err.message });
  }
};