const getEventRsvps = async (req, res) => {
  try {
    const { eventId } = req.params;
    const supabase = req.app.get('supabase');
    
    const { data, error } = await supabase
      .from('rsvps')
      .select('*, user:profiles(*)')
      .eq('event_id', eventId);
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRsvp = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const { email, phone_number } = req.body;
    const supabase = req.app.get('supabase');
    
    // Check if event exists and has capacity
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('event_capacity, rsvps:rsvps(count)')
      .eq('event_id', eventId)
      .single();
      
    if (eventError) throw eventError;
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Check if event has capacity
    const currentRsvps = event.rsvps?.[0]?.count || 0;
    if (event.event_capacity && currentRsvps >= event.event_capacity) {
      return res.status(400).json({ message: 'Event is at capacity' });
    }
    
    // Check if user already RSVP'd
    const { data: existingRsvp, error: existingError } = await supabase
      .from('rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (existingError) throw existingError;
    if (existingRsvp) {
      return res.status(400).json({ message: 'You have already RSVP\'d to this event' });
    }
    
    // Create RSVP
    const { data, error } = await supabase
      .from('rsvps')
      .insert([{
        event_id: eventId,
        user_id: userId,
        email,
        phone_number,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelMyRsvp = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const supabase = req.app.get('supabase');
    
    // Delete the RSVP
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEventRsvps,
  createRsvp,
  cancelMyRsvp
};
