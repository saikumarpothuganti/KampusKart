import webpush from 'web-push';
import PushSubscription from '../models/PushSubscription.js';

// Configure web-push with VAPID keys (do this once at import time)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

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

// POST /api/push/test (STEP 2A: Test notification to all subscriptions)
export const sendTestNotification = async (req, res) => {
  try {
    // Fetch all push subscriptions from MongoDB
    const subscriptions = await PushSubscription.find();

    if (subscriptions.length === 0) {
      return res.status(404).json({ message: 'No subscriptions found' });
    }

    const payload = JSON.stringify({
      title: 'KampusKart',
      body: 'Notifications are working 🎉',
      icon: '/icon-192x192.png',
    });

    let successCount = 0;
    let failureCount = 0;
    const errors = [];

    // Loop through each subscription and send notification
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        successCount++;
      } catch (error) {
        failureCount++;
        errors.push({
          endpoint: sub.subscription.endpoint.substring(0, 50) + '...',
          error: error.message,
        });
        console.error(`Failed to send notification to ${sub.subscription.endpoint}:`, error.message);
        // Continue to next subscription instead of crashing
      }
    }

    res.json({
      message: 'Test notification campaign completed',
      totalSubscriptions: subscriptions.length,
      successCount,
      failureCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error sending test notifications:', error);
    res.status(500).json({ error: 'Failed to send test notifications' });
  }
};
