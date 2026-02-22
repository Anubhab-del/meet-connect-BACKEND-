import Interview from '../models/Interview.js';

// Resource mapping based on interview type
const resourceMap = {
  Frontend: [
    { title: 'Frontend Interview Questions - InterviewBit', url: 'https://www.interviewbit.com/frontend-interview-questions/' },
    { title: 'CSS Tricks', url: 'https://css-tricks.com' },
    { title: 'JavaScript.info', url: 'https://javascript.info' },
  ],
  Backend: [
    { title: 'Backend Interview Questions - InterviewBit', url: 'https://www.interviewbit.com/backend-developer-interview-questions/' },
    { title: 'Node.js Docs', url: 'https://nodejs.org/en/docs' },
    { title: 'Express.js Guide', url: 'https://expressjs.com/en/guide/routing.html' },
  ],
  'Full-Stack': [
    { title: 'Full Stack Interview Questions', url: 'https://www.interviewbit.com/full-stack-developer-interview-questions/' },
    { title: 'The Odin Project', url: 'https://www.theodinproject.com' },
    { title: 'roadmap.sh Full Stack', url: 'https://roadmap.sh/full-stack' },
  ],
  DSA: [
    { title: 'LeetCode', url: 'https://leetcode.com' },
    { title: 'NeetCode.io', url: 'https://neetcode.io' },
    { title: 'GeeksForGeeks DSA', url: 'https://www.geeksforgeeks.org/data-structures/' },
  ],
  Behavioral: [
    { title: 'Behavioral Interview Guide', url: 'https://www.interviewbit.com/behavioral-interview-questions/' },
    { title: 'STAR Method Explained', url: 'https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique' },
    { title: 'Top Behavioral Questions', url: 'https://www.themuse.com/advice/behavioral-interview-questions-answers-examples' },
  ],
};

// @POST /api/interviews  — Schedule a new interview
export const scheduleInterview = async (req, res) => {
  const { interviewType, date, time, interviewer } = req.body;
  try {
    const resources = resourceMap[interviewType] || [];
    const interview = await Interview.create({
      user: req.user._id,
      interviewType,
      date,
      time,
      interviewer,
      resources,
    });
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/interviews/upcoming  — Get upcoming interviews for logged-in user
export const getUpcomingInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
      status: 'upcoming',
    }).sort({ date: 1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/interviews/completed  — Get completed interviews for logged-in user
export const getCompletedInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
      status: 'completed',
    }).sort({ date: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/interviews/:id  — Update interview (mark complete, add feedback)
export const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/interviews/:id  — Cancel/delete an interview
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await interview.deleteOne();
    res.json({ message: 'Interview cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};