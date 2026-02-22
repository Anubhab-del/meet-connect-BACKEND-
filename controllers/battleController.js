import Battle from '../models/Battle.js';
import User from '../models/User.js';

const battleQuestions = {
  Frontend: [
    'Explain the difference between useState and useReducer in React. When would you use each?',
    'What is CSS specificity and how does the cascade work?',
    'Explain event bubbling and capturing in JavaScript.',
    'What are React hooks rules and why do they exist?',
    'Explain the difference between controlled and uncontrolled components in React.',
  ],
  Backend: [
    'Explain the difference between authentication and authorization with examples.',
    'What is database indexing and when would you use it?',
    'Explain the concept of middleware in Express.js.',
    'What is the difference between SQL and NoSQL databases?',
    'How would you handle rate limiting in a Node.js API?',
  ],
  'Full-Stack': [
    'Explain the full lifecycle of an HTTP request in a MERN application.',
    'What is CORS and how do you handle it in a full-stack app?',
    'Explain JWT authentication flow from frontend to backend.',
    'What is the difference between server-side and client-side rendering?',
    'How would you implement real-time features in a MERN stack app?',
  ],
  DSA: [
    'Explain the difference between BFS and DFS with use cases.',
    'What is dynamic programming? Give a real-world example.',
    'Explain the two-pointer technique with an example.',
    'What is the time complexity of QuickSort and why?',
    'Explain how a hash table works and handles collisions.',
  ],
  Behavioral: [
    'Tell me about a time you had to learn a new technology very quickly.',
    'Describe a situation where you disagreed with your team. How did you handle it?',
    'Tell me about your most challenging project and what you learned.',
    'How do you prioritize tasks when everything seems equally urgent?',
    'Describe a time you received critical feedback. How did you respond?',
  ],
};

// @POST /api/battle/create
export const createBattle = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) return res.status(400).json({ message: 'Category is required' });

    const questions = battleQuestions[category];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    const battle = await Battle.create({
      challenger: req.user._id,
      category,
      question: randomQuestion,
      status: 'waiting',
    });

    res.status(201).json(battle);
  } catch (error) {
    console.error('Create battle error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/battle/open
export const getOpenBattles = async (req, res) => {
  try {
    const battles = await Battle.find({
      status: 'waiting',
      challenger: { $ne: req.user._id },
    })
      .populate('challenger', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(battles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/battle/join/:id
export const joinBattle = async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) return res.status(404).json({ message: 'Battle not found' });
    if (battle.status !== 'waiting') return res.status(400).json({ message: 'Battle already started' });
    if (battle.challenger.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot join your own battle' });
    }

    battle.opponent = req.user._id;
    battle.status = 'active';
    await battle.save();

    res.json(battle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/battle/submit/:id
export const submitAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const battle = await Battle.findById(req.params.id);
    if (!battle) return res.status(404).json({ message: 'Battle not found' });

    const isChallenger = battle.challenger.toString() === req.user._id.toString();
    const isOpponent = battle.opponent?.toString() === req.user._id.toString();

    if (!isChallenger && !isOpponent) {
      return res.status(403).json({ message: 'Not a participant in this battle' });
    }

    // Score the answer (simple scoring based on length and keywords)
    const score = Math.min(10, Math.max(1, Math.floor(answer.trim().split(' ').length / 10)));

    if (isChallenger) {
      battle.challengerAnswer = answer;
      battle.challengerScore = score;
      battle.challengerFeedback = `Good attempt! Your answer covered ${answer.trim().split(' ').length} words. Focus on being more concise and structured.`;
    } else {
      battle.opponentAnswer = answer;
      battle.opponentScore = score;
      battle.opponentFeedback = `Good attempt! Your answer covered ${answer.trim().split(' ').length} words. Focus on being more concise and structured.`;
    }

    // If both answered, determine winner
    if (battle.challengerAnswer && battle.opponentAnswer) {
      battle.status = 'completed';
      if (battle.challengerScore > battle.opponentScore) {
        battle.winner = battle.challenger;
      } else if (battle.opponentScore > battle.challengerScore) {
        battle.winner = battle.opponent;
      }
    }

    await battle.save();
    res.json(battle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/battle/my
export const getMyBattles = async (req, res) => {
  try {
    const battles = await Battle.find({
      $or: [{ challenger: req.user._id }, { opponent: req.user._id }],
    })
      .populate('challenger', 'name')
      .populate('opponent', 'name')
      .populate('winner', 'name')
      .sort({ createdAt: -1 });

    res.json(battles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/battle/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const completedBattles = await Battle.find({ status: 'completed', winner: { $ne: null } })
      .populate('winner', 'name');

    const winCounts = {};
    completedBattles.forEach((battle) => {
      const winnerId = battle.winner._id.toString();
      const winnerName = battle.winner.name;
      if (!winCounts[winnerId]) winCounts[winnerId] = { name: winnerName, wins: 0 };
      winCounts[winnerId].wins++;
    });

    const leaderboard = Object.values(winCounts)
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 10);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/battle/:id
export const getBattle = async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id)
      .populate('challenger', 'name')
      .populate('opponent', 'name')
      .populate('winner', 'name');

    if (!battle) return res.status(404).json({ message: 'Battle not found' });
    res.json(battle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};