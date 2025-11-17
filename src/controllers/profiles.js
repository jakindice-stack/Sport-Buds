const getProfiles = async (req, res) => {
  try {
    const { sport_interest, skill_level, location } = req.query;
    const supabase = req.app.get('supabase');
    
    let query = supabase.from('profiles').select('*');
    
    if (sport_interest) query = query.eq('sport_interest', sport_interest);
    if (skill_level) query = query.eq('skill_level', skill_level);
    if (location) query = query.ilike('location', `%${location}%`);
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const supabase = req.app.get('supabase');
    const userId = req.user?.id; // Assuming you have user info in req.user from auth middleware
    
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Profile not found' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const supabase = req.app.get('supabase');
    const userId = req.user?.id;
    const updates = req.body;
    
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;
    const supabase = req.app.get('supabase');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();
      
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Profile not found' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const { email, name, ...profileData } = req.body;
    const supabase = req.app.get('supabase');
    
    // First create the auth user if needed
    // This would depend on your auth setup
    
    // Then create the profile
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, email, name, ...profileData }])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfiles,
  getMyProfile,
  updateMyProfile,
  getProfileById,
  createProfile
};
