import User from '../models/User.js';
import Settings from '../models/Settings.js';

export const spinWheel = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Strict token check for non-admins
    if (!user.isAdmin) {
      if (user.luckyTokens <= 0) {
        return res.status(400).json({ error: 'No lucky tokens available.' });
      }
      user.luckyTokens -= 1;
    }

    // Fetch or create counters
    let rs9CountDoc = await Settings.findOne({ key: 'wheel_winners_rs9' });
    let pct20CountDoc = await Settings.findOne({ key: 'wheel_winners_20pct' });
    let spinsCountDoc = await Settings.findOne({ key: 'wheel_total_spins' });
    let nextDropDoc = await Settings.findOne({ key: 'wheel_next_drop' });
    
    if (!rs9CountDoc) rs9CountDoc = new Settings({ key: 'wheel_winners_rs9', value: 0 });
    if (!pct20CountDoc) pct20CountDoc = new Settings({ key: 'wheel_winners_20pct', value: 0 });
    if (!spinsCountDoc) spinsCountDoc = new Settings({ key: 'wheel_total_spins', value: 0 });
    
    // Initialize next drop to be 4-6 spins from now if it doesn't exist
    if (!nextDropDoc) {
      const nextDropTarget = spinsCountDoc.value + Math.floor(Math.random() * 4) + 6; // 6, 7, 8, or 9
      nextDropDoc = new Settings({ key: 'wheel_next_drop', value: nextDropTarget });
    }

    let reward = 'none';
    const rand = Math.random();
    
    if (user.isAdmin) {
      // Admin gets 25% chance of everything for testing, does not consume quota or trigger guaranteed drops
      if (rand < 0.25) {
        reward = 'rs9';
        user.rs9Tokens += 1;
      } else if (rand < 0.50) {
        reward = '20pct';
        user.pct20Tokens += 1;
      } else if (rand < 0.75) {
        reward = 'extraSpin';
        user.luckyTokens += 1;
      }
    } else {
      // Non-admin spin
      spinsCountDoc.value += 1;
      await spinsCountDoc.save();

      // Check if we hit the guaranteed drop threshold
      let forceDrop = false;
      if (spinsCountDoc.value >= nextDropDoc.value) {
        forceDrop = true;
        // Calculate next drop: 6 to 9 spins from now (around 7-8)
        nextDropDoc.value = spinsCountDoc.value + Math.floor(Math.random() * 4) + 6;
        await nextDropDoc.save();
      }

      // If forced drop, give a top prize if available
      if (forceDrop) {
        if (rs9CountDoc.value < 2 && pct20CountDoc.value < 2) {
          // Randomly pick between the two if both available
          if (Math.random() < 0.5) {
            reward = 'rs9';
            rs9CountDoc.value += 1;
            user.rs9Tokens += 1;
          } else {
            reward = '20pct';
            pct20CountDoc.value += 1;
            user.pct20Tokens += 1;
          }
        } else if (rs9CountDoc.value < 2) {
          reward = 'rs9';
          rs9CountDoc.value += 1;
          user.rs9Tokens += 1;
        } else if (pct20CountDoc.value < 2) {
          reward = '20pct';
          pct20CountDoc.value += 1;
          user.pct20Tokens += 1;
        }
        await rs9CountDoc.save();
        await pct20CountDoc.save();
      }
      
      // If no forced drop happened (either not triggered, or limits reached), fall back to normal rare probabilities
      if (reward === 'none') {
        // 0.00 to 0.02 (2% chance) for Rs 9 Book
        if (rand < 0.02 && rs9CountDoc.value < 2) {
          reward = 'rs9';
          rs9CountDoc.value += 1;
          await rs9CountDoc.save();
          user.rs9Tokens += 1;
        } 
        // 0.02 to 0.05 (3% chance) for 20% Off
        else if (rand >= 0.02 && rand < 0.05 && pct20CountDoc.value < 2) {
          reward = '20pct';
          pct20CountDoc.value += 1;
          await pct20CountDoc.save();
          user.pct20Tokens += 1;
        } 
        // 0.05 to 0.20 (15% chance) for Extra Spin
        else if (rand >= 0.05 && rand < 0.20) {
          reward = 'extraSpin';
          user.luckyTokens += 1;
        }
      }
    }

    await user.save();

    res.json({ reward });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getWinners = async (req, res) => {
  try {
    const winners = await User.find({
      isAdmin: false,
      $or: [{ rs9Tokens: { $gt: 0 } }, { pct20Tokens: { $gt: 0 } }]
    }).select("name collegeId phone rs9Tokens pct20Tokens");
    
    const formattedWinners = [];
    winners.forEach(user => {
      if (user.rs9Tokens > 0) {
        for(let i=0; i<user.rs9Tokens; i++) formattedWinners.push({ name: user.name, collegeId: user.collegeId, phone: user.phone, reward: "₹9 Book" });
      }
      if (user.pct20Tokens > 0) {
        for(let i=0; i<user.pct20Tokens; i++) formattedWinners.push({ name: user.name, collegeId: user.collegeId, phone: user.phone, reward: "20% OFF" });
      }
    });

    res.json(formattedWinners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

