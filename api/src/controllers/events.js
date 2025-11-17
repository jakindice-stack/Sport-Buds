const getEvents = async (req, res) => {
  try {
    const { sport_type, skill_level, date_from, date_to, location } = req.query;
    const supabase = req.app.get('supabase');
    
    let query = supabase
      .from('events')
      .select(`
        *,
        host:profiles(*)
      `);
    
    if (sport_type) query = query.eq('sport_type', sport_type);
    if (skill_level) query = query.eq('skill_level', skill_level);
    if (location) query = query.ilike('location', `%${location}%`);
    if (date_from && date_to) {
      query = query.gte('event_date', date_from).lte('event_date', date_to);
    } else if (date_from) {
      query = query.gte('event_date', date_from);
    } else if (date_to) {
      query = query.lte('event_date', date_to);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const eventData = {
      ...req.body,
      user_id: userId,
      created_at: new Date().toISOString()
    };
    
    const supabase = req.app.get('supabase');
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const supabase = req.app.get('supabase');
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        host:profiles(*),
        rsvps:rsvps(*, user:profiles(*))
      `)
      .eq('event_id', eventId)
      .single();
      
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Event not found' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const supabase = req.app.get('supabase');
    
    // First verify the user owns this event
    const { data: event } = await supabase
      .from('events')
      .select('user_id')
      .eq('event_id', eventId)
      .single();
      
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    const { data, error } = await supabase
      .from('events')
      .update({
        ...req.body,
        updated_at: new Date().toISOString()
      })
      .eq('event_id', eventId)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const supabase = req.app.get('supabase');
    
    // First verify the user owns this event
    const { data: event } = await supabase
      .from('events')
      .select('user_id')
      .eq('event_id', eventId)
      .single();
      
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    // Delete related RSVPs first
    await supabase
      .from('rsvps')
      .delete()
      .eq('event_id', eventId);
    
    // Delete the event
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('event_id', eventId);
      
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent
};
