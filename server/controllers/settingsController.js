import Settings from '../models/Settings.js';

export const getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Settings.findOne({ key });
    
    if (!setting) {
      return res.json({ value: null });
    }
    
    return res.json({ value: setting.value });
  } catch (error) {
    console.error(`[Settings] Error getting setting ${req.params.key}:`, error);
    res.status(500).json({ error: 'Failed to get setting' });
  }
};

export const setSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const setting = await Settings.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    
    return res.json({ message: 'Setting updated successfully', setting });
  } catch (error) {
    console.error(`[Settings] Error setting ${req.params.key}:`, error);
    res.status(500).json({ error: 'Failed to set setting' });
  }
};
