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

// REUSABLE HELPER: Send notification to specific user (STEP 3)
export const sendNotificationToUser = async (userId, title, body, icon = '/icon-192x192.png') => {
  try {
    if (!userId) {
      console.error('[Push] sendNotificationToUser: userId is required');
      return { success: false, message: 'userId is required' };
    }

    // Fetch all subscriptions for this user
    const subscriptions = await PushSubscription.find({ userId });

    if (subscriptions.length === 0) {
      console.log(`[Push] No subscriptions found for user ${userId}`);
      return { success: true, message: 'No subscriptions found', sentCount: 0 };
    }

    const payload = JSON.stringify({
      title,
      body,
      icon,
    });

    let sentCount = 0;
    let failureCount = 0;

    // Loop through each subscription for this user
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        sentCount++;
      } catch (error) {
        failureCount++;
        console.error(`[Push] Failed to send notification to ${sub.subscription.endpoint}:`, error.message);
        // Continue to next subscription (do not crash)
      }
    }

    console.log(`[Push] Sent notification to ${sentCount}/${subscriptions.length} devices for user ${userId}`);
    return { success: true, sentCount, failureCount };
  } catch (error) {
    console.error('[Push] sendNotificationToUser error:', error);
    return { success: false, message: error.message };
  }
};

// POST /api/push/subscribe (STEP 1: Save user subscription with userId)
export const subscribe = async (req, res) => {
  try {
    const { subscription, userId } = req.body;

    // userId must be provided (from authenticated user)
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription data' });
    }

    // Check if subscription already exists for this user+endpoint
    const existing = await PushSubscription.findOne({
      userId,
      'subscription.endpoint': subscription.endpoint,
    });

    if (existing) {
      return res.json({ message: 'Subscription already exists', subscription: existing });
    }

    // Create new subscription with userId
    const newSubscription = new PushSubscription({
      userId,
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

// POST /api/push/test (Test notification to all subscriptions)
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
