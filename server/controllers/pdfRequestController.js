import PDFRequest from '../models/PDFRequest.js';

const generateRequestId = async () => {
  let requestId = '';
  let isUnique = false;
  while (!isUnique) {
    const randomNum = Math.floor(Math.random() * 10000);
    requestId = `REQ${randomNum.toString().padStart(4, '0')}`;
    const existing = await PDFRequest.findOne({ requestId });
    isUnique = !existing;
  }
  return requestId;
};

// User creates a PDF request
export const createPDFRequest = async (req, res) => {
  try {
    const { title, pdfUrl, qty, sides } = req.body;

    console.log('PDF Request received:', { title, pdfUrl, qty, sides, userId: req.user?.id });

    if (!title || !pdfUrl || !qty || !sides) {
      console.error('Missing fields:', { title: !!title, pdfUrl: !!pdfUrl, qty: !!qty, sides: !!sides });
      return res.status(400).json({ error: 'Missing required fields: title, pdfUrl, qty, and sides' });
    }

    const requestId = await generateRequestId();

    const newRequest = new PDFRequest({
      userId: req.user.id,
      requestId,
      title,
      pdfUrl,
      qty: parseInt(qty),
      sides: parseInt(sides),
      status: 'pending',
    });

    await newRequest.save();
    console.log('PDF Request created:', newRequest.requestId);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('PDF Request creation error:', error);
    res.status(500).json({ error: error.message });
  }
};

// User gets their own PDF requests
export const getMyPDFRequests = async (req, res) => {
  try {
    const requests = await PDFRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin gets all PDF requests
export const getAllPDFRequests = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const requests = await PDFRequest.find()
      .populate('userId', 'name userId email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin sets price for a PDF request
export const setPDFRequestPrice = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { requestId } = req.params;
    const { price } = req.body;

    if (price === undefined || price === null || price < 0) {
      return res.status(400).json({ error: 'Valid price required' });
    }

    const request = await PDFRequest.findOneAndUpdate(
      { requestId },
      { price, status: 'priced' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'PDF request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User cancels their PDF request
export const cancelPDFRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await PDFRequest.findOne({ requestId });

    if (!request) {
      return res.status(404).json({ error: 'PDF request not found' });
    }

    if (request.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    request.status = 'cancelled';
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark request as added to cart
export const markAsAddedToCart = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await PDFRequest.findOne({ requestId });

    if (!request) {
      return res.status(404).json({ error: 'PDF request not found' });
    }

    if (request.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (request.status !== 'priced') {
      return res.status(400).json({ error: 'Request must be priced first' });
    }

    request.status = 'added_to_cart';
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin deletes a PDF request
export const deletePDFRequest = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    const request = await PDFRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ error: 'PDF request not found' });
    }

    res.json({ message: 'PDF request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
