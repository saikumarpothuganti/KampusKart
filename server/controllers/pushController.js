import PushSubscription from '../models/PushSubscription.js';

// POST /api/push/subscribe
export const subscribe = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription data' });
    }

    // Check if subscription already exists (avoid duplicates)
    const existing = await PushSubscription.findOne({
      'subscription.endpoint': subscription.endpoint,
    });

    if (existing) {
      return res.json({ message: 'Subscription already exists', subscription: existing });
    }

    // Create new subscription
    const newSubscription = new PushSubscription({
      userId: req.user?.id || null, // Optional: if user is logged in
      subscription: {
        endpoint: subscription.endpoint,
        keys: subscription.keys || {},
      },
    });

    await newSubscription.save();

    res.status(201).json({
      message: 'Push subscription saved successfully',
      subscription: newSubscription,
    });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
};
