import Subject from '../models/Subject.js';

export const getSubjectsByYearSem = async (req, res) => {
  try {
    const { year, sem } = req.query;

    if (!year || !sem) {
      return res.status(400).json({ error: 'Year and semester required' });
    }

    const subjects = await Subject.find({ year: parseInt(year), sem: parseInt(sem), availability: true });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { title, code, year, sem, price, coverUrl, availability } = req.body;

    if (!title || !code || !year || !sem || !price) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const newSubject = new Subject({
      title,
      code,
      year: parseInt(year),
      sem: parseInt(sem),
      price: parseFloat(price),
      coverUrl,
      availability: availability !== undefined ? availability : true,
    });

    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, code, year, sem, price, coverUrl, availability } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      id,
      {
        title,
        code,
        year: parseInt(year),
        sem: parseInt(sem),
        price: parseFloat(price),
        coverUrl,
        ...(availability !== undefined ? { availability } : {}),
      },
      { new: true }
    );

    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const adminUpdateSubject = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { title, price, availability } = req.body;

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (price !== undefined) updatePayload.price = parseFloat(price);
    if (availability !== undefined) updatePayload.availability = availability;

    const subject = await Subject.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
