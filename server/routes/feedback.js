import express from 'express';
import jwt from 'jsonwebtoken';
import Feedback from '../models/Feedback.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Submit feedback (allow both authenticated and unauthenticated users)
router.post('/', async (req, res) => {
  console.log('=== Feedback POST endpoint hit ===');
  console.log('Request body:', req.body);
  
  try {
    const { name, department, feedback, rating, email } = req.body;

    console.log('Parsed fields:', { name, department, feedbackLength: feedback?.length, rating, email });

    // Validate required fields
    if (!name || !department || !feedback || !rating) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { name: !!name, department: !!department, feedback: !!feedback, rating: !!rating }
      });
    }

    // Extract userId from token if available (optional auth)
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        console.log('Feedback from authenticated user:', userId);
      } catch (err) {
        console.log('Token verification failed, continuing as anonymous:', err.message);
      }
    } else {
      console.log('No authentication token provided');
    }

    console.log('Creating feedback document...');
    const newFeedback = new Feedback({
      userId: userId || undefined,
      name,
      email: email || '',
      department,
      feedback,
      rating: Number(rating),
    });

    console.log('Saving feedback to database...');
    const savedFeedback = await newFeedback.save();
    console.log('Feedback saved successfully with ID:', savedFeedback._id);
    
    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedbackId: savedFeedback._id 
    });
  } catch (error) {
    console.error('=== Error submitting feedback ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: error.name 
    });
  }
});

// Get all feedback (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete feedback (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;
    console.log('Deleting feedback:', id);

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    console.log('Feedback deleted successfully');
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
