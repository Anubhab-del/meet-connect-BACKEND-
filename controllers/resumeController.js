import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const skillsDatabase = {
  Frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'redux', 'nextjs', 'webpack', 'sass'],
  Backend: ['node', 'express', 'python', 'django', 'flask', 'java', 'spring', 'mongodb', 'postgresql', 'mysql', 'redis', 'rest', 'api'],
  DSA: ['algorithms', 'data structures', 'leetcode', 'competitive programming', 'dynamic programming', 'graphs', 'trees'],
  'Full-Stack': ['mern', 'mean', 'full stack', 'fullstack', 'docker', 'aws', 'ci/cd', 'git', 'agile'],
  Behavioral: ['leadership', 'teamwork', 'communication', 'project management', 'collaboration', 'mentoring'],
};

const roadmaps = {
  Frontend: [
    { week: 'Week 1-2', task: 'Master JavaScript fundamentals — closures, promises, async/await' },
    { week: 'Week 3-4', task: 'Deep dive into React — hooks, context, performance optimization' },
    { week: 'Week 5-6', task: 'Practice 20 frontend interview questions daily' },
    { week: 'Week 7-8', task: 'Build 2 portfolio projects using React and Tailwind CSS' },
    { week: 'Week 9-10', task: 'Schedule 3 mock interviews on MeetConnect' },
    { week: 'Week 11-12', task: 'Final prep — system design basics and behavioral questions' },
  ],
  Backend: [
    { week: 'Week 1-2', task: 'Strengthen Node.js and Express fundamentals' },
    { week: 'Week 3-4', task: 'Deep dive into databases — MongoDB, PostgreSQL, indexing' },
    { week: 'Week 5-6', task: 'Practice REST API design and authentication patterns' },
    { week: 'Week 7-8', task: 'Learn system design concepts — scalability, caching, queues' },
    { week: 'Week 9-10', task: 'Schedule 3 backend mock interviews on MeetConnect' },
    { week: 'Week 11-12', task: 'Final prep — security, performance optimization' },
  ],
  DSA: [
    { week: 'Week 1-2', task: 'Master arrays, strings, and hash maps on LeetCode' },
    { week: 'Week 3-4', task: 'Practice trees, graphs, and BFS/DFS problems' },
    { week: 'Week 5-6', task: 'Learn dynamic programming patterns' },
    { week: 'Week 7-8', task: 'Solve 5 LeetCode medium problems daily' },
    { week: 'Week 9-10', task: 'Schedule 3 DSA mock interviews on MeetConnect' },
    { week: 'Week 11-12', task: 'Final prep — review all patterns and edge cases' },
  ],
  'Full-Stack': [
    { week: 'Week 1-2', task: 'Review both frontend and backend fundamentals' },
    { week: 'Week 3-4', task: 'Build a full MERN stack project from scratch' },
    { week: 'Week 5-6', task: 'Learn deployment — Docker, AWS/Render, CI/CD basics' },
    { week: 'Week 7-8', task: 'Practice system design for full-stack applications' },
    { week: 'Week 9-10', task: 'Schedule 3 full-stack mock interviews on MeetConnect' },
    { week: 'Week 11-12', task: 'Final prep — performance, security, scalability' },
  ],
  Behavioral: [
    { week: 'Week 1-2', task: 'Learn and practice the STAR method for all answers' },
    { week: 'Week 3-4', task: 'Prepare 10 stories from your past experience' },
    { week: 'Week 5-6', task: 'Practice answering top 50 behavioral questions' },
    { week: 'Week 7-8', task: 'Record yourself answering questions and review' },
    { week: 'Week 9-10', task: 'Schedule 3 behavioral mock interviews on MeetConnect' },
    { week: 'Week 11-12', task: 'Final prep — research companies and tailor answers' },
  ],
};

const extractTextFromPDF = async (filePath) => {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const loadingTask = pdfjsLib.getDocument({ url: filePath });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    fullText += pageText + ' ';
  }

  return { text: fullText, numPages: pdf.numPages };
};

// @POST /api/resume/analyze
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume' });
    }

    const filePath = path.resolve(req.file.path);
    let pdfData;

    try {
      pdfData = await extractTextFromPDF(filePath);
    } catch (parseError) {
      console.error('PDF parse error:', parseError.message);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Could not read PDF. Please upload a valid text-based PDF.' });
    }

    const text = pdfData.text.toLowerCase();

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ message: 'Resume appears to be empty or scanned. Please upload a text-based PDF.' });
    }

    const detectedSkills = {};
    const missingSkills = {};
    const categoryScores = {};

    Object.keys(skillsDatabase).forEach((category) => {
      const skills = skillsDatabase[category];
      const found = skills.filter((skill) => text.includes(skill.toLowerCase()));
      const missing = skills.filter((skill) => !text.includes(skill.toLowerCase())).slice(0, 4);
      detectedSkills[category] = found;
      missingSkills[category] = missing;
      categoryScores[category] = Math.round((found.length / skills.length) * 100);
    });

    const bestFit = Object.keys(categoryScores).sort(
      (a, b) => categoryScores[b] - categoryScores[a]
    )[0];

    const overallScore = Math.round(
      Object.values(categoryScores).reduce((a, b) => a + b, 0) / Object.keys(categoryScores).length
    );

    const strengths = Object.keys(detectedSkills)
      .filter((cat) => detectedSkills[cat].length > 2)
      .map((cat) => `Strong ${cat} skills: ${detectedSkills[cat].slice(0, 3).join(', ')}`);

    const gaps = Object.keys(missingSkills)
      .filter((cat) => missingSkills[cat].length > 2)
      .map((cat) => `Missing ${cat} skills: ${missingSkills[cat].slice(0, 3).join(', ')}`);

    const roadmap = roadmaps[bestFit] || roadmaps['Full-Stack'];

    res.json({
      overallScore,
      bestFit,
      categoryScores,
      detectedSkills,
      missingSkills,
      strengths: strengths.slice(0, 4),
      gaps: gaps.slice(0, 4),
      roadmap,
      wordCount: pdfData.text.split(' ').length,
      pageCount: pdfData.numPages,
    });
  } catch (error) {
    console.error('Resume analyze error:', error.message);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message || 'Failed to analyze resume' });
  }
};