const User = require('../models/User');
// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const userProfile = await User.findById(req.user.id).select('-password');
    if (!userProfile) return res.status(404).json({ message: 'User not found' });
    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Update user target macros
// @route   PUT /api/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const { target_calories, target_protein, target_carbs, target_fat, target_water } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        target_calories,
        target_protein,
        target_carbs,
        target_fat,
        target_water,
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};