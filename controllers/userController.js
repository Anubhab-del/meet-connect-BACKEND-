import User from '../models/User.js';

// @GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // email is NOT updatable
    user.name = req.body.name || user.name;
    user.contactNumber = req.body.contactNumber || user.contactNumber;
    user.dob = req.body.dob || user.dob;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      contactNumber: updatedUser.contactNumber,
      dob: updatedUser.dob,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};