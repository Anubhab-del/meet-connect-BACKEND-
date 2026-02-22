import mongoose from 'mongoose';

const battleSchema = new mongoose.Schema({
  challenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  question: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Full-Stack', 'DSA', 'Behavioral'],
    required: true,
  },
  challengerAnswer: { type: String, default: '' },
  opponentAnswer: { type: String, default: '' },
  challengerScore: { type: Number, default: 0 },
  opponentScore: { type: Number, default: 0 },
  challengerFeedback: { type: String, default: '' },
  opponentFeedback: { type: String, default: '' },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed'],
    default: 'waiting',
  },
  timeLimit: {
    type: Number,
    default: 300,
  },
}, { timestamps: true });

const Battle = mongoose.model('Battle', battleSchema);
export default Battle;