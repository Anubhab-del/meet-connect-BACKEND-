import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    console.log('📩 Register request body:', req.body);

    const { name, email, password, contactNumber } = req.body;

    if (!name || !email || !password || !contactNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      contactNumber: contactNumber.trim(),
    });

    const savedUser = await user.save();
    console.log('✅ User saved:', savedUser._id);

    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      contactNumber: savedUser.contactNumber,
      token: generateToken(savedUser._id),
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    console.log('📩 Login request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful:', user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};