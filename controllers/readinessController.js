import Interview from '../models/Interview.js';

// @GET /api/readiness
export const getReadinessScore = async (req, res) => {
  try {
    const completedInterviews = await Interview.find({
      user: req.user._id,
      status: 'completed',
    });

    const categories = ['Frontend', 'Backend', 'Full-Stack', 'DSA', 'Behavioral'];

    const categoryScores = {};
    const categoryCounts = {};

    categories.forEach((cat) => {
      categoryScores[cat] = 0;
      categoryCounts[cat] = 0;
    });

    completedInterviews.forEach((interview) => {
      const type = interview.interviewType;
      if (categoryScores[type] !== undefined && interview.score !== undefined) {
        categoryScores[type] += interview.score;
        categoryCounts[type]++;
      }
    });

    const readiness = {};
    let totalScore = 0;
    let totalCategories = 0;

    categories.forEach((cat) => {
      if (categoryCounts[cat] > 0) {
        const avg = categoryScores[cat] / categoryCounts[cat];
        readiness[cat] = Math.round((avg / 10) * 100);
        totalScore += readiness[cat];
        totalCategories++;
      } else {
        readiness[cat] = 0;
      }
    });

    const overallReadiness = totalCategories > 0
      ? Math.round(totalScore / totalCategories)
      : 0;

    const getRecommendation = () => {
      const weakest = categories
        .filter((cat) => readiness[cat] > 0)
        .sort((a, b) => readiness[a] - readiness[b])[0];

      if (!weakest) return 'Start scheduling mock interviews to track your readiness!';
      if (overallReadiness >= 80) return `You're almost ready! Polish your ${weakest} skills for a final boost.`;
      if (overallReadiness >= 60) return `Good progress! Focus on improving your ${weakest} score next.`;
      return `Keep practicing! Your ${weakest} interviews need the most attention right now.`;
    };

    const getLabel = () => {
      if (overallReadiness >= 80) return 'Almost Ready!';
      if (overallReadiness >= 60) return 'Getting There';
      if (overallReadiness >= 40) return 'In Progress';
      if (overallReadiness > 0) return 'Just Starting';
      return 'No Data Yet';
    };

    const history = completedInterviews
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((interview) => ({
        date: interview.date,
        type: interview.interviewType,
        score: interview.score || 0,
        result: interview.result,
      }));

    res.json({
      readiness,
      overallReadiness,
      label: getLabel(),
      recommendation: getRecommendation(),
      totalInterviews: completedInterviews.length,
      history,
    });
  } catch (error) {
    console.error('Readiness score error:', error.message);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};