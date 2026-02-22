import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  interviewType: {
    type: String,
    enum: ['Behavioral', 'Full-Stack', 'Frontend', 'Backend', 'DSA'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  interviewer: {
    name: { type: String, required: true },
    role: { type: String },
    avatar: { type: String },
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  // Populated after interview is completed
  feedback: { type: String, default: '' },
  score: { type: Number, min: 0, max: 10 },
  result: {
    type: String,
    enum: ['Pass', 'Fail', 'Pending'],
    default: 'Pending',
  },
  resources: [{ title: String, url: String }],
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;