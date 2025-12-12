const submitEventReport = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const { reason, comment = null, reported_user_id: reportedUserId = null } = req.body ?? {};
    const supabase = req.supabase ?? req.app.get('supabase');

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return res.status(400).json({ message: 'reason is required to submit a report' });
    }
    
    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single();
      
    if (eventError) throw eventError;
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // If reporting a user, check if they exist
    if (reportedUserId) {
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', reportedUserId)
        .single();
        
      if (userError) throw userError;
      if (!user) return res.status(404).json({ message: 'User not found' });
    }
    
    // Create the report
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        reporter_id: userId,
        reported_event_id: eventId,
        reported_user_id: reportedUserId,
        reason: reason.trim(),
        comment,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitUserReport = async (req, res) => {
  try {
    const { userId: reportedUserId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { reason, comment = null } = req.body ?? {};
    const supabase = req.supabase ?? req.app.get('supabase');

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return res.status(400).json({ message: 'reason is required to submit a report' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', reportedUserId)
      .single();

    if (profileError) throw profileError;
    if (!profile) return res.status(404).json({ message: 'User not found' });

    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          reporter_id: userId,
          reported_user_id: reportedUserId,
          reported_event_id: null,
          reason: reason.trim(),
          comment,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listReports = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    // In a real app, you'd check if the user is an admin here
    // For now, we'll just return all reports
    
    const supabase = req.supabase ?? req.app.get('supabase');
    
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        reporter:profiles!reports_reporter_id_fkey(*),
        reported_user:profiles!reports_user_id_fkey(*),
        event:events(*)
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitEventReport,
  submitUserReport,
  listReports
};
