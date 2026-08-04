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
    const {
      title,
      code,
      year,
      sem,
      singleSidePrice,
      doubleSidePrice,
      basic_singleSidePrice,
      basic_doubleSidePrice,
      rapid_singleSidePrice,
      rapid_doubleSidePrice,
      basicStock,
      coverUrl,
      pdfUrl,
      availability,
    } = req.body;

    // Parse year and sem to integers
    const parsedYear = year ? parseInt(year, 10) : null;
    const parsedSem = sem ? parseInt(sem, 10) : null;

    if (!title || !code || !parsedYear || !parsedSem) {
      return res.status(400).json({ error: 'Title, code, year, and sem are required' });
    }

    if (
      (singleSidePrice === undefined || singleSidePrice === '' || singleSidePrice === null) &&
      (doubleSidePrice === undefined || doubleSidePrice === '' || doubleSidePrice === null)
    ) {
      return res.status(400).json({ error: 'Provide single-side or double-side price' });
    }

    const newSubject = new Subject({
      title,
      code,
      year: parsedYear,
      sem: parsedSem,
      singleSidePrice: singleSidePrice && singleSidePrice !== null ? parseFloat(singleSidePrice) : undefined,
      doubleSidePrice: doubleSidePrice && doubleSidePrice !== null ? parseFloat(doubleSidePrice) : undefined,
      basic_singleSidePrice: basic_singleSidePrice ? parseFloat(basic_singleSidePrice) : undefined,
      basic_doubleSidePrice: basic_doubleSidePrice ? parseFloat(basic_doubleSidePrice) : undefined,
      rapid_singleSidePrice: rapid_singleSidePrice ? parseFloat(rapid_singleSidePrice) : undefined,
      rapid_doubleSidePrice: rapid_doubleSidePrice ? parseFloat(rapid_doubleSidePrice) : undefined,
      basicStock: basicStock ? parseInt(basicStock) : undefined,
      coverUrl,
      pdfUrl: pdfUrl || null,
      availability: availability !== undefined ? availability : true,
    });

    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, code, year, sem, singleSidePrice, doubleSidePrice, basic_singleSidePrice, basic_doubleSidePrice, rapid_singleSidePrice, rapid_doubleSidePrice, coverUrl, pdfUrl, availability, basicStock } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      id,
      {
        title,
        code,
        year: parseInt(year),
        sem: parseInt(sem),
        singleSidePrice: singleSidePrice ? parseFloat(singleSidePrice) : null,
        doubleSidePrice: doubleSidePrice ? parseFloat(doubleSidePrice) : null,
        basic_singleSidePrice: basic_singleSidePrice ? parseFloat(basic_singleSidePrice) : null,
        basic_doubleSidePrice: basic_doubleSidePrice ? parseFloat(basic_doubleSidePrice) : null,
        rapid_singleSidePrice: rapid_singleSidePrice ? parseFloat(rapid_singleSidePrice) : null,
        rapid_doubleSidePrice: rapid_doubleSidePrice ? parseFloat(rapid_doubleSidePrice) : null,
        basicStock: basicStock !== undefined ? parseInt(basicStock) : 6,
        coverUrl,
        pdfUrl: pdfUrl || null,
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
    const { title, singleSidePrice, doubleSidePrice, basic_singleSidePrice, basic_doubleSidePrice, rapid_singleSidePrice, rapid_doubleSidePrice, pdfUrl, availability, basicStock } = req.body;

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (singleSidePrice !== undefined) updatePayload.singleSidePrice = singleSidePrice ? parseFloat(singleSidePrice) : null;
    if (doubleSidePrice !== undefined) updatePayload.doubleSidePrice = doubleSidePrice ? parseFloat(doubleSidePrice) : null;
    if (basic_singleSidePrice !== undefined) updatePayload.basic_singleSidePrice = basic_singleSidePrice ? parseFloat(basic_singleSidePrice) : null;
    if (basic_doubleSidePrice !== undefined) updatePayload.basic_doubleSidePrice = basic_doubleSidePrice ? parseFloat(basic_doubleSidePrice) : null;
    if (rapid_singleSidePrice !== undefined) updatePayload.rapid_singleSidePrice = rapid_singleSidePrice ? parseFloat(rapid_singleSidePrice) : null;
    if (rapid_doubleSidePrice !== undefined) updatePayload.rapid_doubleSidePrice = rapid_doubleSidePrice ? parseFloat(rapid_doubleSidePrice) : null;
    if (basicStock !== undefined) updatePayload.basicStock = parseInt(basicStock);
    if (pdfUrl !== undefined) updatePayload.pdfUrl = pdfUrl || null;
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
