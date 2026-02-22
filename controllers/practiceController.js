import practiceQuestions from '../data/practiceQuestions.js';

const blogs = [
  { id: 1, title: '10 Tips to Ace Your Technical Interview', url: 'https://www.freecodecamp.org/news/the-definitive-guide-to-acing-your-technical-interview/', category: 'Technical' },
  { id: 2, title: 'How to Prepare for Behavioral Interviews', url: 'https://www.themuse.com/advice/behavioral-interview-questions-answers-examples', category: 'Behavioral' },
  { id: 3, title: 'Mastering the STAR Method', url: 'https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique', category: 'Behavioral' },
  { id: 4, title: 'System Design Interview Guide', url: 'https://www.educative.io/blog/complete-guide-system-design-interview', category: 'Technical' },
  { id: 5, title: 'Top DSA Patterns You Must Know', url: 'https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question', category: 'Technical' },
  { id: 6, title: 'React Interview Preparation Guide', url: 'https://www.freecodecamp.org/news/react-interview-questions-and-answers/', category: 'Technical' },
];

// @GET /api/practice/questions?category=Frontend&page=1&limit=10
export const getQuestions = (req, res) => {
  const { category = 'Frontend', page = 1, limit = 10 } = req.query;
  const questions = practiceQuestions[category] || [];
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginated = questions.slice(startIndex, endIndex);

  res.json({
    category,
    totalQuestions: questions.length,
    totalPages: Math.ceil(questions.length / parseInt(limit)),
    currentPage: parseInt(page),
    questions: paginated,
  });
};

// @GET /api/practice/blogs
export const getBlogs = (req, res) => {
  res.json(blogs);
};